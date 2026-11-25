const { MongoClient } = require("mongodb");
const { createClient } = require("redis");
const { performance } = require("perf_hooks");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const REDIS_URI = process.env.REDIS_URI || "redis://127.0.0.1:6379";

function generateSampleGtfs() {
  const stops = [];
  const trips = [];
  const stopTimes = [];

  for (let i = 1; i <= 500; i++) {
    stops.push({
      stop_id: `STOP_${i}`,
      stop_name: `Stop ${i}`,
      stop_lat: 6.45 + (i % 50) * 0.004,
      stop_lon: 3.35 + Math.floor(i / 50) * 0.015,
    });
  }

  for (let t = 1; t <= 200; t++) {
    const tripId = `TRIP_${t}`;
    trips.push({
      trip_id: tripId,
      route_id: `ROUTE_${(t % 10) + 1}`,
      service_id: "WEEKDAY",
    });

    const baseDeparture = 21600 + (t % 40) * 900;
    for (let seq = 1; seq <= 100; seq++) {
      const stopNumber = ((t + seq) % 500) + 1;
      const arrivalSec = baseDeparture + seq * 180;
      stopTimes.push({
        trip_id: tripId,
        stop_id: `STOP_${stopNumber}`,
        stop_sequence: seq,
        arrival_seconds: arrivalSec,
        departure_seconds: arrivalSec + 30,
      });
    }
  }

  return { stops, trips, stopTimes };
}

function getPercentile(sortedValues, percentile) {
  const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
  return sortedValues[Math.max(0, index)].toFixed(3);
}

async function main() {
  const { stops, trips, stopTimes } = generateSampleGtfs();

  const mongoClient = new MongoClient(MONGO_URI);
  const redisClient = createClient({ url: REDIS_URI });

  await mongoClient.connect();
  await redisClient.connect();

  const db = mongoClient.db("gtfs_trip_benchmark");
  await db.dropDatabase();
  await redisClient.flushDb();

  // Ingest & Index into MongoDB
  const mongoIngestStart = performance.now();
  await db.collection("stops").insertMany(
    stops.map((stop) => ({
      ...stop,
      location: {
        type: "Point",
        coordinates: [stop.stop_lon, stop.stop_lat],
      },
    }))
  );
  await db.collection("trips").insertMany(trips);
  await db.collection("stop_times").insertMany(stopTimes);
  await db.collection("stops").createIndex({ location: "2dsphere" });
  await db.collection("stop_times").createIndex({ stop_id: 1, departure_seconds: 1 });
  const mongoIngestMs = (performance.now() - mongoIngestStart).toFixed(2);

  // Ingest & Index into Redis
  const redisIngestStart = performance.now();
  const pipeline = redisClient.multi();
  for (const stop of stops) {
    pipeline.geoAdd("stops:geo", {
      longitude: stop.stop_lon,
      latitude: stop.stop_lat,
      member: stop.stop_id,
    });
    pipeline.hSet(`stop:${stop.stop_id}`, {
      name: stop.stop_name,
      lat: String(stop.stop_lat),
      lon: String(stop.stop_lon),
    });
  }
  for (const st of stopTimes) {
    pipeline.zAdd(`stop:departures:${st.stop_id}`, {
      score: st.departure_seconds,
      value: `${st.trip_id}:${st.stop_sequence}`,
    });
  }
  await pipeline.exec();
  const redisIngestMs = (performance.now() - redisIngestStart).toFixed(2);

  // Benchmark Trip-Planning Lookups (Nearest Stop + Next 5 Departures After 30600s)
  const runs = 500;
  const mongoTimes = [];
  const redisTimes = [];

  for (let i = 0; i < runs; i++) {
    const lat = 6.5 + (i % 10) * 0.005;
    const lon = 3.4 + (i % 10) * 0.005;

    const mStart = performance.now();
    const nearbyMongoStops = await db
      .collection("stops")
      .find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lon, lat] },
            $maxDistance: 800,
          },
        },
      })
      .limit(1)
      .toArray();

    if (nearbyMongoStops.length > 0) {
      await db
        .collection("stop_times")
        .find({
          stop_id: nearbyMongoStops[0].stop_id,
          departure_seconds: { $gte: 30600 },
        })
        .sort({ departure_seconds: 1 })
        .limit(5)
        .toArray();
    }
    mongoTimes.push(performance.now() - mStart);

    const rStart = performance.now();
    const nearbyRedisStops = await redisClient.geoSearch(
      "stops:geo",
      { longitude: lon, latitude: lat },
      { radius: 800, unit: "m" },
      { SORT: "ASC", COUNT: 1 }
    );

    if (nearbyRedisStops.length > 0) {
      await redisClient.zRangeByScore(
        `stop:departures:${nearbyRedisStops[0]}`,
        30600,
        "+inf",
        { LIMIT: { offset: 0, count: 5 } }
      );
    }
    redisTimes.push(performance.now() - rStart);
  }

  mongoTimes.sort((a, b) => a - b);
  redisTimes.sort((a, b) => a - b);
  const avg = (arr) => (arr.reduce((acc, v) => acc + v, 0) / arr.length).toFixed(3);

  console.log("Benchmark Results:");
  console.table([
    {
      Engine: "MongoDB",
      IngestAndIndexMs: mongoIngestMs,
      AvgQueryMs: avg(mongoTimes),
      P95QueryMs: getPercentile(mongoTimes, 95),
      P99QueryMs: getPercentile(mongoTimes, 99),
    },
    {
      Engine: "Redis",
      IngestAndIndexMs: redisIngestMs,
      AvgQueryMs: avg(redisTimes),
      P95QueryMs: getPercentile(redisTimes, 95),
      P99QueryMs: getPercentile(redisTimes, 99),
    },
  ]);

  await mongoClient.close();
  await redisClient.quit();
}

main().catch((err) => {
  console.error("Benchmark failed:", err);
  process.exit(1);
});
