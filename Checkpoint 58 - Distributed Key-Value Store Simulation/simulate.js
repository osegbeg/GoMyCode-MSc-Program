const DistributedKVStore = require("./src/distributedKVStore");

const sampleData = [
  { key: "user:101", value: { name: "Alice" } },
  { key: "user:102", value: { name: "Bob" } },
  { key: "user:103", value: { name: "Charlie" } },
  { key: "user:104", value: { name: "Diana" } },
  { key: "user:105", value: { name: "Eve" } },
  { key: "user:106", value: { name: "Frank" } },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSimulation() {
  console.log("=== 1. INITIALIZING DISTRIBUTED KV STORE (3 NODES, REPLICATION FACTOR = 2) ===");
  const kv = new DistributedKVStore({
    initialNodes: ["node-1", "node-2", "node-3"],
    virtualNodes: 40,
    replicationFactor: 2,
    cacheMaxSize: 3,   // Small cache size to demonstrate LRU eviction
    cacheTtlMs: 1500,  // Short TTL (1.5s) to demonstrate expiration
  });

  for (const item of sampleData) {
    kv.put(item.key, item.value);
  }

  console.log("Initial key distribution across nodes:");
  console.log(JSON.stringify(kv.getDistributionSummary(), null, 2));

  console.log("\n=== 2. TRANSPARENT READS & CACHING (LRU + TTL) ===");
  console.log("First read user:101 (populated or cache hit):", kv.get("user:101"));
  console.log("Second read user:101 (from cache):", kv.get("user:101"));

  // Read several keys so cache capacity (3) evicts oldest entries via LRU
  kv.get("user:102");
  kv.get("user:103");
  kv.get("user:104");
  console.log("Read user:101 after LRU evictions:", kv.get("user:101"));

  console.log("Waiting 1600ms for TTL expiration...");
  await sleep(1600);
  console.log("Read user:104 after TTL expiry (re-fetched from storage):", kv.get("user:104"));

  console.log("\n=== 3. NODE JOIN (ADDING 'node-4') — MINIMAL KEY MOVEMENT ===");
  const joinResult = kv.addNode("node-4");
  console.log(`Keys whose primary owner shifted: ${joinResult.movedKeysCount} / ${sampleData.length}`);
  console.log("Moved keys:", joinResult.movedDetails);
  console.log(JSON.stringify(kv.getDistributionSummary(), null, 2));

  console.log("\n=== 4. NODE LEAVE (REMOVING 'node-2') — MINIMAL KEY MOVEMENT ===");
  const leaveResult = kv.removeNode("node-2");
  console.log(`Keys whose primary owner shifted: ${leaveResult.movedKeysCount} / ${sampleData.length}`);
  console.log("Moved keys:", leaveResult.movedDetails);
  console.log(JSON.stringify(kv.getDistributionSummary(), null, 2));

  console.log("\n=== 5. NODE FAILURE SIMULATION & LIMITED AVAILABILITY ===");
  const targetKey = "user:105";
  const replicas = kv.ring.getPreferenceList(targetKey, kv.replicationFactor);
  console.log(`Replicas for ${targetKey}:`, replicas);

  // Clear cache so read must hit storage nodes directly
  kv.cache.clear();
  kv.failNode(replicas[0]);
  console.log(`Simulated failure on primary replica ${replicas[0]}. Reading ${targetKey}:`);
  console.log(kv.get(targetKey));

  // Bring all remaining replicas down for this key to demonstrate limited availability
  for (const r of replicas) {
    kv.failNode(r);
  }
  console.log(`Simulated failure on ALL replicas (${replicas.join(", ")}) for ${targetKey}:`);
  console.log(kv.get(targetKey));
}

runSimulation();
