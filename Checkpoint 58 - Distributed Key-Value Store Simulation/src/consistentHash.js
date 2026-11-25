const crypto = require("crypto");

/**
 * ConsistentHashRing maps physical nodes and keys onto a 32-bit hash ring
 * using virtual nodes (vnodes) so keys distribute evenly and only a small
 * fraction of keys move when nodes join or leave.
 */
class ConsistentHashRing {
  constructor(virtualNodes = 50) {
    this.virtualNodes = virtualNodes;
    this.ring = []; // Sorted array of { hash, nodeId }
    this.nodes = new Set();
  }

  // Deterministic 32-bit unsigned integer hash using MD5
  hashKey(input) {
    const digest = crypto.createHash("md5").update(String(input)).digest();
    return digest.readUInt32BE(0);
  }

  // Binary search for the first ring entry with hash >= targetHash
  _findRingIndex(targetHash) {
    let low = 0;
    let high = this.ring.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.ring[mid].hash < targetHash) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return low === this.ring.length ? 0 : low;
  }

  addNode(nodeId) {
    if (this.nodes.has(nodeId)) return;
    this.nodes.add(nodeId);

    for (let i = 0; i < this.virtualNodes; i++) {
      const vnodeKey = `${nodeId}#vnode-${i}`;
      this.ring.push({ hash: this.hashKey(vnodeKey), nodeId });
    }

    this.ring.sort((a, b) => a.hash - b.hash);
  }

  removeNode(nodeId) {
    if (!this.nodes.has(nodeId)) return;
    this.nodes.delete(nodeId);
    this.ring = this.ring.filter((entry) => entry.nodeId !== nodeId);
  }

  // Returns up to `count` distinct physical nodes clockwise from the key hash
  getPreferenceList(key, count = 2) {
    if (this.ring.length === 0) return [];

    const keyHash = this.hashKey(key);
    let idx = this._findRingIndex(keyHash);
    const result = [];
    const seen = new Set();

    while (result.length < count && seen.size < this.nodes.size) {
      const candidate = this.ring[idx].nodeId;
      if (!seen.has(candidate)) {
        seen.add(candidate);
        result.push(candidate);
      }
      idx = (idx + 1) % this.ring.length;
    }

    return result;
  }

  getPrimaryNode(key) {
    const list = this.getPreferenceList(key, 1);
    return list[0] || null;
  }
}

module.exports = ConsistentHashRing;
