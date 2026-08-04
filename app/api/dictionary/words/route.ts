import type { NextRequest } from "next/server"
import { sql } from "@/lib/server/db"
import { escapeLikePrefix, offsetFor, parseIntParam } from "@/lib/server/params"
import { json, serverError } from "@/lib/server/respond"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface Row {
  id: number
  words: string
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const letter = params.get("letter")
  const page = parseIntParam(params.get("page"), { fallback: 1, min: 1 })
  const limit = parseIntParam(params.get("limit"), { fallback: 10, min: 1, max: 500 })
  const offset = offsetFor(page, limit)

  // ORDER BY id is added on top of the original query: the Python version paginated an
  // unordered DISTINCT, which lets Postgres return rows in any order and can repeat or
  // drop entries across pages. Because id is the PK and rows are loaded in file order,
  // the ordered result matches what the old API returned in practice.
  try {
    const rows = letter
      ? await sql<Row>`
          SELECT DISTINCT id, words
          FROM word_meaning
          WHERE words LIKE ${`${escapeLikePrefix(letter)}%`}
          ORDER BY id
          OFFSET ${offset}
          LIMIT ${limit}
        `
      : await sql<Row>`
          SELECT DISTINCT id, words
          FROM word_meaning
          ORDER BY id
          OFFSET ${offset}
          LIMIT ${limit}
        `

    return json(rows.map((row) => ({ id: row.id, word: row.words })))
  } catch (cause) {
    return serverError("GET /api/dictionary/words", cause)
  }
}
