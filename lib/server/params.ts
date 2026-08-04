/**
 * Query-param parsing that mirrors the FastAPI validators the Python API used,
 * e.g. `page: int = Query(default=1, ge=1)` and `limit: int = Query(default=10, le=500)`.
 */

interface IntParamOptions {
  fallback: number
  min?: number
  max?: number
}

export function parseIntParam(
  raw: string | null,
  { fallback, min = 1, max = Number.MAX_SAFE_INTEGER }: IntParamOptions
): number {
  const parsed = Number.parseInt(raw ?? "", 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(Math.max(parsed, min), max)
}

/** Offset for 1-based page numbers. */
export function offsetFor(page: number, limit: number): number {
  return (page - 1) * limit
}

/**
 * A `letter`/`word` value safe to interpolate into a LIKE pattern. Values still go
 * through parameterised SQL; this only stops `%` and `_` in user input from turning a
 * prefix scan into a full-table wildcard match.
 */
export function escapeLikePrefix(value: string): string {
  return value.replace(/([\\%_])/g, "\\$1")
}
