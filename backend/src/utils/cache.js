const redis = require("../config/redis");

/**
 * Get a cached value or fetch fresh data, then cache it.
 * Upstash Redis auto-serializes/deserializes JSON, so we store
 * objects directly and return them as-is.
 *
 * @param {string} key   - Cache key
 * @param {number} ttl   - Time-to-live in seconds
 * @param {Function} callback - Async function that returns fresh data
 */
async function getOrSetCache(key, ttl, callback) {
  const cached = await redis.get(key);

  if (cached !== null && cached !== undefined) {
    console.log(`[Cache HIT]  ${key}`);
    return cached;
  }

  console.log(`[Cache MISS] ${key}`);

  const freshData = await callback();

  // Upstash @upstash/redis accepts objects directly (JSON-serialized internally)
  await redis.set(key, freshData, { ex: ttl });

  return freshData;
}

/**
 * Invalidate (delete) one or more cache keys.
 * @param {...string} keys
 */
async function invalidateCache(...keys) {
  if (keys.length === 0) return;
  await redis.del(...keys);
  console.log(`[Cache DEL]  ${keys.join(", ")}`);
}

module.exports = {
  getOrSetCache,
  invalidateCache,
};