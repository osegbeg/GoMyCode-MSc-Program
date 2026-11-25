const ConsistentHashRing = require("./consistentHash");
const LRUTTLCache = require("./cache");
const StorageNode = require("./storageNode");

/**
 * DistributedKVStore provides a single transparent interface for `get` and `put`
 * while coordinating consistent hashing, replication, caching, rebalancing, and failover.
 */
class DistributedKVStore {
  constructor({
    initialNodes = ["node-1", "node-2", "node-3"],
    virtualNodes = 50,
    replicationFactor = 2,
    cacheMaxSize = 4,
    cacheTtlMs = 10000,
  } = {}) {
    this.replicationFactor = replicationFactor;
    this.ring = new ConsistentHashRing(virtualNodes);
    this.nodes = new Map();
    this.cache = new LRUTTLCache({ maxSize: cacheMaxSize, defaultTtlMs: cacheTtlMs });

    for (const nodeId of initialNodes) {
      this.addNode(nodeId, { rebalance: false });
    }
  }

  _allTrackedKeys() {
    const keys = new Set();
    for (const node of this.nodes.values()) {
      for (const key of node.data.keys()) {
        keys.add(key);
      }
    }
    return Array.from(keys);
  }

  // Rebalance keys so every key is stored on its current preference list of live nodes
  _rebalance() {
    const allKeys = this._allTrackedKeys();
    const snapshots = new Map();

    for (const node of this.nodes.values()) {
      if (node.isUp) {
        snapshots.set(node.nodeId, new Map(node.data));
      }
    }

    let movedKeysCount = 0;
    const movedDetails = [];

    for (const key of allKeys) {
      const targetNodes = this.ring.getPreferenceList(key, this.replicationFactor);
      let value;

      for (const snap of snapshots.values()) {
        if (snap.has(key)) {
          value = snap.get(key);
          break;
        }
      }

      if (value === undefined) continue;

      const previousPrimary = this._findCurrentPrimary(key);
      const nextPrimary = targetNodes[0];

      if (previousPrimary && nextPrimary && previousPrimary !== nextPrimary) {
        movedKeysCount++;
        movedDetails.push(`${key}: ${previousPrimary} -> ${nextPrimary}`);
      }

      for (const nodeId of targetNodes) {
        const targetNode = this.nodes.get(nodeId);
        if (targetNode && targetNode.isUp) {
          targetNode.put(key, value);
        }
      }
    }

    // Remove stale replicas from nodes no longer in a key's preference list
    for (const [nodeId, node] of this.nodes.entries()) {
      if (!node.isUp) continue;
      for (const key of Array.from(node.data.keys())) {
        const allowed = this.ring.getPreferenceList(key, this.replicationFactor);
        if (!allowed.includes(nodeId)) {
          node.delete(key);
        }
      }
    }

    this.cache.clear();
    return { movedKeysCount, movedDetails };
  }

  _findCurrentPrimary(key) {
    for (const [nodeId, node] of this.nodes.entries()) {
      if (node.isUp && node.has(key) && this.ring.getPrimaryNode(key) === nodeId) {
        return nodeId;
      }
    }
    return this.ring.getPrimaryNode(key);
  }

  addNode(nodeId, { rebalance = true } = {}) {
    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, new StorageNode(nodeId));
    } else {
      this.nodes.get(nodeId).setUp();
    }
    this.ring.addNode(nodeId);

    if (rebalance) {
      return this._rebalance();
    }
    return { movedKeysCount: 0, movedDetails: [] };
  }

  removeNode(nodeId) {
    const target = this.nodes.get(nodeId);
    if (!target) return { movedKeysCount: 0, movedDetails: [] };

    const backupEntries = target.entries();
    this.ring.removeNode(nodeId);
    this.nodes.delete(nodeId);

    // Ensure any data that lived on the departing node is placed on remaining nodes
    for (const [key, value] of backupEntries) {
      const replicas = this.ring.getPreferenceList(key, this.replicationFactor);
      for (const replicaId of replicas) {
        const replicaNode = this.nodes.get(replicaId);
        if (replicaNode && replicaNode.isUp) {
          replicaNode.put(key, value);
        }
      }
    }

    return this._rebalance();
  }

  failNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.setDown();
    }
  }

  recoverNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.setUp();
    }
  }

  // Transparent write: caller passes only (key, value)
  put(key, value) {
    const replicas = this.ring.getPreferenceList(key, this.replicationFactor);
    const writtenTo = [];
    const failedNodes = [];

    for (const nodeId of replicas) {
      const node = this.nodes.get(nodeId);
      if (!node || !node.isUp) {
        failedNodes.push(nodeId);
        continue;
      }
      node.put(key, value);
      writtenTo.push(nodeId);
    }

    if (writtenTo.length === 0) {
      return {
        ok: false,
        key,
        error: "Service unavailable: all replica nodes for this key are down.",
      };
    }

    this.cache.set(key, value);

    return {
      ok: true,
      key,
      value,
      writtenTo,
      degraded: failedNodes.length > 0,
      unavailableReplicas: failedNodes,
    };
  }

  // Transparent read: checks cache first, then primary node, then replica nodes
  get(key) {
    const cachedValue = this.cache.get(key);
    if (cachedValue !== null && cachedValue !== undefined) {
      return {
        ok: true,
        key,
        value: cachedValue,
        source: "CACHE (LRU/TTL)",
      };
    }

    const replicas = this.ring.getPreferenceList(key, this.replicationFactor);
    let hitAnyReplicaNode = false;

    for (let i = 0; i < replicas.length; i++) {
      const nodeId = replicas[i];
      const node = this.nodes.get(nodeId);
      if (!node || !node.isUp) continue;

      hitAnyReplicaNode = true;
      const val = node.get(key);
      if (val !== undefined) {
        this.cache.set(key, val);
        return {
          ok: true,
          key,
          value: val,
          source: i === 0 ? `PRIMARY (${nodeId})` : `REPLICA FALLBACK (${nodeId})`,
        };
      }
    }

    if (!hitAnyReplicaNode) {
      return {
        ok: false,
        key,
        error: "Limited availability: all replica nodes for this key are currently unreachable.",
      };
    }

    return {
      ok: false,
      key,
      error: `Key "${key}" not found.`,
    };
  }

  getDistributionSummary() {
    const summary = {};
    for (const [nodeId, node] of this.nodes.entries()) {
      summary[nodeId] = {
        status: node.isUp ? "UP" : "DOWN",
        keys: Array.from(node.data.keys()),
      };
    }
    return summary;
  }
}

module.exports = DistributedKVStore;
