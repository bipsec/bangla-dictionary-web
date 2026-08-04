import type { NextRequest } from "next/server"
import { sql } from "@/lib/server/db"
import { offsetFor, parseIntParam } from "@/lib/server/params"
import { badRequest, json, notFound, parseJsonArray, serverError } from "@/lib/server/respond"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface Row {
  id: number
  meaning: string | null
  pos: string | null
  pos_full: string | null
  pronunciation: string | null
  ipa: string | null
  root_lang: string | null
  topic_marker: string | null
  example: string | null
  synonyms: string | null
  page_no: string | null
  source: string | null
  female_marker: string | null
  antonyms: string | null
  rhyme_words: string | null
  english: string | null
  pouranic_source: string | null
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
      SELECT id, meaning, pos, pos_full, pronunciation, ipa, root_lang, topic_marker,
             example, synonyms, page_no, source, female_marker, antonyms, rhyme_words,
             english, pouranic_source
      FROM enriched_dictionary
      WHERE word = ${word}
      ORDER BY id
      OFFSET ${offset}
      LIMIT ${limit}
    `

    if (rows.length === 0) return notFound()

    // Word-level fields are duplicated across every meaning row; take them from the first.
    const first = rows[0]

    return json({
      word,
      ipa: rows.find((row) => row.ipa)?.ipa ?? "",
      female_marker: first.female_marker,
      antonyms: parseJsonArray(first.antonyms),
      rhyme_words: parseJsonArray(first.rhyme_words),
      english: parseJsonArray(first.english),
      pouranic_source: first.pouranic_source,
      meanings: rows.map((row) => ({
        id: row.id,
        meaning: row.meaning,
        pos: row.pos,
        pos_full: row.pos_full,
        pronunciation: row.pronunciation,
        ipa: row.ipa,
        root_lang: row.root_lang,
        topic_marker: row.topic_marker,
        example: row.example,
        synonyms: parseJsonArray(row.synonyms),
        page: row.page_no,
        source: row.source,
      })),
    })
  } catch (cause) {
    return serverError(`GET /api/complete-dictionary/word word=${word}`, cause)
  }
}
