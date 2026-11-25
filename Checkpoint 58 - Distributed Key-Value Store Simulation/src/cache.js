/**
 * LRUTTLCache evicts least-recently-used entries when at capacity
 * and expires entries whose Time-To-Live (TTL) has elapsed.
 */
class LRUTTLCache {
  constructor({ maxSize = 4, defaultTtlMs = 5000 } = {}) {
    this.maxSize = maxSize;
    this.defaultTtlMs = defaultTtlMs;
    this.store = new Map(); // Preserves insertion/access order (oldest first)
  }

  _isExpired(entry) {
    return Date.now() > entry.expiresAt;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (this._isExpired(entry)) {
      this.store.delete(key);
      return null;
    }

    // Refresh recency by moving to the end of the Map
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxSize) {
      // Evict the least recently used (first) item
      const oldestKey = this.store.keys().next().value;
      this.store.delete(oldestKey);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  invalidate(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

module.exports = LRUTTLCache;
