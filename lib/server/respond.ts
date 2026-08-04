import { NextResponse } from "next/server"

/**
 * Dictionary content never changes between deploys, so let Vercel's CDN serve
 * repeat requests and keep the database out of the hot path.
 */
const IMMUTABLE_CACHE = "public, s-maxage=86400, stale-while-revalidate=604800"

export function json<T>(data: T, { cache = true }: { cache?: boolean } = {}) {
  return NextResponse.json(data, {
    headers: cache ? { "Cache-Control": IMMUTABLE_CACHE } : { "Cache-Control": "no-store" },
  })
}

/** Matches the old FastAPI error body: `{"detail": "..."}`. */
export function errorResponse(status: number, detail: string) {
  return NextResponse.json({ detail }, { status, headers: { "Cache-Control": "no-store" } })
}

export function notFound(detail = "Word not found") {
  return errorResponse(404, detail)
}

export function badRequest(detail: string) {
  return errorResponse(400, detail)
}

/** Log the cause server-side; never leak internals to the client. */
export function serverError(context: string, cause: unknown) {
  console.error(`[api] ${context} failed:`, cause)
  return errorResponse(500, "Internal Server Error")
}

/**
 * The enriched rows store `synonyms`/`antonyms`/`rhyme_words`/`english` as JSON text.
 * A malformed row degrades to an empty list rather than failing the whole request
 * (the Python version raised, turning one bad row into a 500).
 */
export function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === "string")
  } catch {
    return []
  }
}
