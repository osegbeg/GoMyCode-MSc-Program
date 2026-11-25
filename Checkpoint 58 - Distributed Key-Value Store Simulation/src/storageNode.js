/**
 * StorageNode represents an independent storage server holding key-value data.
 * When `isUp` is false, the node simulates a crash/network partition.
 */
class StorageNode {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.data = new Map();
    this.isUp = true;
  }

  setDown() {
    this.isUp = false;
  }

  setUp() {
    this.isUp = true;
  }

  put(key, value) {
    if (!this.isUp) {
      throw new Error(`Node ${this.nodeId} is down`);
    }
    this.data.set(key, value);
  }

  get(key) {
    if (!this.isUp) {
      throw new Error(`Node ${this.nodeId} is down`);
    }
    return this.data.has(key) ? this.data.get(key) : undefined;
  }

  has(key) {
    if (!this.isUp) {
      throw new Error(`Node ${this.nodeId} is down`);
    }
    return this.data.has(key);
  }

  delete(key) {
    if (!this.isUp) {
      throw new Error(`Node ${this.nodeId} is down`);
    }
    return this.data.delete(key);
  }

  entries() {
    return Array.from(this.data.entries());
  }
}

module.exports = StorageNode;
