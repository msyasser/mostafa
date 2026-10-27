// Best-effort, in-memory fixed-window limiter. On serverless each instance has
// its own counters, so this slows down abuse but is not a hard guarantee; swap
// the Map for a shared store (Upstash / Vercel KV) for strict limits.
const buckets = new Map();
const MAX_BUCKETS = 5000;

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }

  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;
  return {
    ok: entry.count <= limit,
    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
  };
}

export function getClientIp(headers) {
  const forwarded = headers?.get?.("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers?.get?.("x-real-ip") || "unknown";
}
