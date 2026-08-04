import type { NextRequest } from "next/server"
import { sql } from "@/lib/server/db"
import { offsetFor, parseIntParam } from "@/lib/server/params"
import { badRequest, json, serverError } from "@/lib/server/respond"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface Row {
  id: number
  number: string | null
  meaning: string | null
  pos: string | null
  spelling: string | null
  root_lang: string | null
  sentence: string | null
  source: string | null
  ipa: string | null
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const word = params.get("word")
  if (!word) return badRequest("Missing required query parameter: word")

  const page = parseIntParam(params.get("page"), { fallback: 1, min: 1 })
  const limit = parseIntParam(params.get("limit"), { fallback: 10, min: 1, max: 100 })
  const offset = offsetFor(page, limit)

  try {
    const rows = await sql<Row>`
      SELECT id, number, meaning, pos, spelling, root_lang, sentence, source, ipa
      FROM word_meaning
      WHERE words = ${word}
      ORDER BY id
      OFFSET ${offset}
      LIMIT ${limit}
    `

    return json({
      word,
      ipa: rows.find((row) => row.ipa)?.ipa ?? "",
      meanings: rows.map((row) => ({
        id: row.id,
        meaning_no: row.number,
        meaning: row.meaning,
        pos: row.pos,
        spelling: row.spelling,
        language: row.root_lang,
        sentence: row.sentence,
        source: row.source,
      })),
    })
  } catch (cause) {
    return serverError(`GET /api/dictionary/word word=${word}`, cause)
  }
}
