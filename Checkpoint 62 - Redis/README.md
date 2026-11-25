# Benchmarking Redis and MongoDB for Trip Planning with GTFS Data

## 1. Introduction to GTFS Data

### What Is GTFS Data and What Information Does It Contain?
The **General Transit Feed Specification (GTFS)** is an open data standard for public transit schedules and geographic network information. It consists of:
* **GTFS Schedule (Static):** A `.zip` feed of `.txt` files:
  * `agency.txt` — Transit agency details and timezones.
  * `stops.txt` — Stop IDs, names, and latitude/longitude (`stop_lat`, `stop_lon`).
  * `routes.txt` — Transit routes and route types.
  * `trips.txt` — Individual journeys along a route tied to a `service_id` and optional `shape_id`.
  * `stop_times.txt` — Arrival/departure times and `stop_sequence` per trip (typically the largest file).
  * `calendar.txt` & `calendar_dates.txt` — Regular operating days and schedule exceptions.
  * `shapes.txt` (optional) — Ordered GPS coordinates for drawing route paths on maps.
* **GTFS Realtime:** Protocol Buffers (`.proto`) feeds for live vehicle positions, trip updates/delays, and service alerts.

### How Can GTFS Data Be Used for Trip Planning?
1. **Find Nearby Stops:** Match user coordinates against `stops.txt` within walking distance for origin and destination.
2. **Filter Active Services:** Check `calendar.txt` and `calendar_dates.txt` for valid `service_id` values on the travel date.
3. **Match Departures & Transfers:** Query `stop_times.txt` and `trips.txt` for departures after the requested time, follow downstream stops, and evaluate transfers.
4. **Rank & Display Routes:** Sort itineraries by travel/arrival time or transfers and render paths using `shapes.txt`.

---

## 2. Overview of Redis and MongoDB

### How Redis and MongoDB Differ from Traditional SQL Databases
| Aspect | Traditional SQL | Redis | MongoDB |
| :--- | :--- | :--- | :--- |
| **Data Model** | Relational tables, rows, columns, foreign keys | Key-value / data structures (Strings, Hashes, Sets, Sorted Sets, Geo) | Document store using BSON (JSON-like) documents |
| **Storage** | Disk-based tables and B-tree indexes | **In-memory (RAM)** with optional RDB/AOF disk persistence | **Disk-backed** (WiredTiger) with RAM working-set cache |
| **Queries** | SQL + `JOIN`s + ACID transactions | Command-driven (`GET`, `HGETALL`, `ZRANGE`, `GEOSEARCH`); no cross-key joins | Rich query language, GeoJSON `2dsphere` queries, aggregation pipelines (`$lookup`) |
| **Scaling** | Mostly vertical + read replicas | Horizontal via **Redis Cluster** (hash slots) | Horizontal **sharding** + replica sets |

### Key Features of Redis and MongoDB
* **Redis:** Sub-millisecond in-memory latency, native `GEOADD`/`GEOSEARCH` commands, Sorted Sets (`ZSET`) for ordered numeric scores (like departure times in seconds), TTL expiration, and Pub/Sub for live transit updates.
* **MongoDB:** Flexible BSON documents, native GeoJSON `2dsphere` indexes, compound indexes, aggregation pipelines, and disk-backed storage suited for datasets larger than RAM.

---

## 3. Benchmarking Criteria

### Criteria
* **Query Latency (p50, p95, p99):** Execution time for nearby-stop and schedule lookups.
* **Throughput (QPS):** Requests handled per second under load.
* **Ingestion & Index Build Time:** Time taken to load GTFS data and create spatial/schedule indexes.
* **Memory & Disk Footprint:** RAM consumption (especially for Redis) and disk/index size (for MongoDB).
* **Query Expressiveness:** Support for combining location, departure time windows, active calendars, and transfers.
* **Scalability & Persistence:** Behavior on large GTFS feeds, sharding/clustering, and durability.

### Why Application-Based Benchmarking Matters
Generic synthetic benchmarks don't mirror trip planning, which combines spatial radius searches (`stops.txt`), time-ordered scans (`stop_times.txt`), and multi-stop trip lookups. Benchmarking with GTFS workloads shows how indexing and memory vs. disk behavior perform under real transit queries.

---

## 4. Data Ingestion and Storage

### Ingesting into Redis
* Load `stops.txt` into a geospatial index (`GEOADD stops:geo <lon> <lat> <stop_id>`) and store stop details in hashes (`HSET stop:<stop_id> ...`).
* Convert `departure_time` into seconds from midnight and load `stop_times.txt` into sorted sets (`ZADD stop:departures:<stop_id> <departure_seconds> <trip_id>:<stop_sequence>`).
* Batch inserts with pipelines (`MULTI`/`EXEC`) for speed.

### Ingesting into MongoDB
* Bulk-insert (`insertMany`) `stops`, `trips`, and `stop_times` into collections.
* Store stop coordinates as GeoJSON `{ type: "Point", coordinates: [lon, lat] }` and create a `2dsphere` index on `location`.
* Create a compound index on `stop_times` for `{ stop_id: 1, departure_seconds: 1 }`.

### Storage Comparison
* **Redis** keeps data in **RAM** for fast in-memory access, but large `stop_times.txt` feeds and duplicated structures increase RAM cost.
* **MongoDB** stores data on **disk** via WiredTiger and caches hot pages/indexes in RAM, handling large schedule datasets more economically at higher disk/cache access latency.

---

## 5. Query Performance

### How They Handle Trip-Planning Queries
* **Redis** executes fast in-memory operations (`GEOSEARCH`, `ZRANGEBYSCORE`, `HGET`), though multi-step lookups across keys can require multiple round-trips or Lua scripts.
* **MongoDB** uses `2dsphere` and compound B-tree indexes plus aggregation pipelines (`$lookup`, `$match`, `$sort`) to filter and combine data in the database.

### Typical Trip-Planning Queries

1. **Stops Within 500m (`lon: 3.3792, lat: 6.5244`):**
   * **Redis:** `GEOSEARCH stops:geo FROMLONLAT 3.3792 6.5244 BYRADIUS 500 m WITHDIST ASC`
   * **MongoDB:**
     ```javascript
     db.stops.find({
       location: {
         $near: {
           $geometry: { type: "Point", coordinates: [3.3792, 6.5244] },
           $maxDistance: 500
         }
       }
     });
     ```

2. **Next 5 Departures at `STOP_101` After 08:30 AM (`30600` seconds):**
   * **Redis:** `ZRANGEBYSCORE stop:departures:STOP_101 30600 +inf LIMIT 0 5`
   * **MongoDB:**
     ```javascript
     db.stop_times
       .find({ stop_id: "STOP_101", departure_seconds: { $gte: 30600 } })
       .sort({ departure_seconds: 1 })
       .limit(5);
     ```

3. **Direct Trips from `STOP_A` to `STOP_B` Between `30600s` and `34200s` (MongoDB Aggregation):**
   ```javascript
   db.stop_times.aggregate([
     { $match: { stop_id: "STOP_A", departure_seconds: { $gte: 30600, $lte: 34200 } } },
     {
       $lookup: {
         from: "stop_times",
         let: { tripId: "$trip_id", depSeq: "$stop_sequence" },
         pipeline: [
           {
             $match: {
               $expr: {
                 $and: [
                   { $eq: ["$trip_id", "$$tripId"] },
                   { $eq: ["$stop_id", "STOP_B"] },
                   { $gt: ["$stop_sequence", "$$depSeq"] }
                 ]
               }
             }
           }
         ],
         as: "destinationStop"
       }
     },
     { $unwind: "$destinationStop" },
     { $sort: { departure_seconds: 1 } },
     { $limit: 5 }
   ]);
   ```

---

## 6. Scalability and Efficiency

* **Redis Scalability:** Scales out via **Redis Cluster** (hash slots), but large GTFS schedule datasets can be RAM-expensive and cross-key operations require hash-slot alignment (hash tags).
* **MongoDB Scalability:** Scales out via **sharding** (e.g., on `{ stop_id: 1, departure_seconds: 1 }` or region) with disk-backed storage and replica sets.
* **Recommendation:** Use **MongoDB** as the primary store for large GTFS datasets and multi-filter trip queries, and pair it with **Redis** when ultra-low-latency caching or GTFS-Realtime live tracking is needed.

---

## 7. Practical Application

### Implementation Steps
1. Create a Node.js project and install `mongodb` and `redis`.
2. Generate or load GTFS sample records (`stops`, `trips`, `stop_times`).
3. Ingest and index records into MongoDB and Redis.
4. Run repeated trip-planning lookups (nearest stop + next 5 departures after `30600s`) and print ingestion and latency metrics.

---

## 8. Conclusion

* **Redis:** Fast in-memory spatial and sorted-set lookups and great for real-time/hot data, but constrained by RAM cost and limited relational/multi-field querying.
* **MongoDB:** Handles large GTFS datasets on disk with rich indexing and aggregation queries, with higher latency than pure in-memory lookups.
* **Future GTFS Choice:** **MongoDB** as the main GTFS database, with **Redis** added when real-time caching/streaming speed is a priority.
