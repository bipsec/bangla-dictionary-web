import type { NextRequest } from "next/server"
import { sql } from "@/lib/server/db"
import { badRequest, json, notFound, serverError } from "@/lib/server/respond"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface Row {
  id: number
  word: string
  description: string
}

export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get("word")
  if (!word) return badRequest("Missing required query parameter: word")

  try {
    const rows = await sql<Row>`
      SELECT id, word, description
      FROM pouranik_utso
      WHERE word = ${word}
      ORDER BY id
    `

    if (rows.length === 0) return notFound()

    return json({
      word: rows[0].word,
      entries: rows.map((row) => ({ id: row.id, description: row.description })),
    })
  } catch (cause) {
    return serverError(`GET /api/pouranik-utso/word word=${word}`, cause)
  }
}
