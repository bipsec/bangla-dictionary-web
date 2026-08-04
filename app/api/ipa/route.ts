import type { NextRequest } from "next/server"
import { sql } from "@/lib/server/db"
import { getModel, maxWordLength, translateToIpa } from "@/lib/server/ipa-model"
import { clientKey, rateLimit } from "@/lib/server/rate-limit"
import { badRequest, errorResponse, json, serverError } from "@/lib/server/respond"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
// Model inference is CPU-bound WASM; a cold start plus a long word needs well over the default.
export const maxDuration = 60

/** Guard against a single request pinning the CPU on a whole paragraph. */
const MAX_TOKENS_PER_REQUEST = 12

interface IpaRow {
  ipa: string | null
}

async function lookupIpa(word: string): Promise<string | null> {
  const fromIpaTable = await sql<IpaRow>`
    SELECT ipa FROM ipa
    WHERE words = ${word} AND ipa IS NOT NULL AND ipa <> ''
    LIMIT 1
  `
  if (fromIpaTable[0]?.ipa) return fromIpaTable[0].ipa

  const fromEnriched = await sql<IpaRow>`
    SELECT ipa FROM enriched_dictionary
    WHERE word = ${word} AND ipa IS NOT NULL AND ipa <> ''
    LIMIT 1
  `
  return fromEnriched[0]?.ipa ?? null
}

/** Cache an inferred transcription so a word is only ever run through the model once. */
async function cacheIpa(word: string, ipa: string): Promise<void> {
  try {
    await sql`INSERT INTO ipa (words, ipa) VALUES (${word}, ${ipa})`
  } catch (cause) {
    // A failed cache write must not fail the request.
    console.error("[api] caching inferred IPA failed:", cause)
  }
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("word")
  if (!input?.trim()) return badRequest("Missing required query parameter: word")

  // The IPA page posts free text from a textarea. The Python version fed the whole string
  // to the model as one "word", which silently broke past the model's positional limit;
  // transcribing token by token makes multi-word input work.
  const tokens = input.trim().split(/\s+/).filter(Boolean)
  if (tokens.length > MAX_TOKENS_PER_REQUEST) {
    return badRequest(`Too many words in one request (max ${MAX_TOKENS_PER_REQUEST}).`)
  }

  try {
    const results: string[] = []
    const sources = new Set<string>()

    for (const token of tokens) {
      const existing = await lookupIpa(token)
      if (existing) {
        results.push(existing)
        sources.add("db")
        continue
      }

      // Inference is the expensive path, so the rate limit only applies here.
      if (!rateLimit(clientKey(request), { capacity: 20, refillPerSecond: 0.5 })) {
        return errorResponse(429, "Too many IPA requests. Please wait a moment.")
      }

      const { config } = await getModel()
      const generated = await translateToIpa(token)
      if (generated === null) {
        return badRequest(`Word is too long to transcribe (max ${maxWordLength(config)} characters).`)
      }

      results.push(generated)
      sources.add("model")
      // Awaited, not fire-and-forget. A serverless function can be frozen or torn down as soon
      // as it responds, so an un-awaited insert may simply never run — and the word would be
      // re-inferred on every future request. Awaiting also removes a race where a second
      // request's lookup overtakes the first request's uncommitted insert, which produced
      // duplicate rows and a spurious second inference. The insert costs far less than the
      // model run it saves, and cacheIpa swallows its own errors.
      if (generated) await cacheIpa(token, generated)
    }

    return json(
      {
        word: input,
        ipa: results.join(" "),
        source: sources.size > 1 ? "mixed" : (sources.values().next().value ?? "db"),
      },
      { cache: false }
    )
  } catch (cause) {
    return serverError(`GET /api/ipa word=${input}`, cause)
  }
}
