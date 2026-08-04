/**
 * Minimal in-memory token bucket, used to keep model inference from monopolising a
 * function instance's CPU.
 *
 * Deliberately per-instance: Vercel runs many instances, so this is a cheap safety valve
 * rather than a global quota. Anything stricter needs shared state (Redis / Vercel KV).
 */

interface Bucket {
  tokens: number
  updatedAt: number
}

const buckets = new Map<string, Bucket>()
const SWEEP_AFTER_MS = 10 * 60 * 1000

export function rateLimit(
  key: string,
  { capacity, refillPerSecond }: { capacity: number; refillPerSecond: number }
): boolean {
  const now = Date.now()
  const bucket = buckets.get(key) ?? { tokens: capacity, updatedAt: now }

  const refill = ((now - bucket.updatedAt) / 1000) * refillPerSecond
  bucket.tokens = Math.min(capacity, bucket.tokens + refill)
  bucket.updatedAt = now

  // Bound memory growth on a long-lived warm instance.
  if (buckets.size > 5000) {
    buckets.forEach((existing, existingKey) => {
      if (now - existing.updatedAt > SWEEP_AFTER_MS) buckets.delete(existingKey)
    })
  }

  if (bucket.tokens < 1) {
    buckets.set(key, bucket)
    return false
  }

  bucket.tokens -= 1
  buckets.set(key, bucket)
  return true
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
}
