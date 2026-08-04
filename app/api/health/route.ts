import { sql } from "@/lib/server/db"
import { errorResponse, json } from "@/lib/server/respond"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await sql`SELECT 1`
    return json({ status: "ok", database: "ok" }, { cache: false })
  } catch (cause) {
    console.error("[api] health check failed:", cause)
    return errorResponse(503, "Database unavailable")
  }
}
