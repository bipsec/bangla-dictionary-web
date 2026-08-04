import type { NextRequest } from "next/server"
import { sql } from "@/lib/server/db"
import { escapeLikePrefix, offsetFor, parseIntParam } from "@/lib/server/params"
import { json, serverError } from "@/lib/server/respond"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface Row {
  id: number
  word: string
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const letter = params.get("letter")
  const page = parseIntParam(params.get("page"), { fallback: 1, min: 1 })
  const limit = parseIntParam(params.get("limit"), { fallback: 10, min: 1, max: 500 })
  const offset = offsetFor(page, limit)

  try {
    const rows = letter
      ? await sql<Row>`
          SELECT id, word
          FROM pouranik_utso
          WHERE word LIKE ${`${escapeLikePrefix(letter)}%`}
          ORDER BY word, id
          OFFSET ${offset}
          LIMIT ${limit}
        `
      : await sql<Row>`
          SELECT id, word
          FROM pouranik_utso
          ORDER BY word, id
          OFFSET ${offset}
          LIMIT ${limit}
        `

    return json(rows.map((row) => ({ id: row.id, word: row.word })))
  } catch (cause) {
    return serverError("GET /api/pouranik-utso/words", cause)
  }
}
