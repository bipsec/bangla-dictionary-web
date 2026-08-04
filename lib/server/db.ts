import { neon } from "@neondatabase/serverless"
import type { Pool as PgPool } from "pg"

/**
 * Database access for the API routes.
 *
 * Two drivers behind one tagged-template interface:
 *
 * - Neon hosts use `@neondatabase/serverless`, which sends each query over HTTPS. That is
 *   the right shape for serverless: no TCP pool to exhaust when Vercel scales out.
 * - Any other host (a local Postgres, or the old Render database) falls back to
 *   node-postgres, so the app is not locked to one provider and can run fully offline.
 *
 * Usage is identical either way:  const rows = await sql`SELECT 1 WHERE x = ${value}`
 */

/**
 * Callers name the row shape they expect: `await sql<Row>\`SELECT ...\``. Nothing validates
 * it at runtime, so keep the type in step with the SELECT list.
 */
type SqlFn = <Row = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Row[]>

function requireConnectionString(): string {
  const value = process.env.DATABASE_URL
  if (!value) {
    throw new Error(
      "DATABASE_URL is not set. Set it in your hosting provider's environment variables " +
        "(locally: copy .env.example to .env.local)."
    )
  }
  return value
}

/** Interpolated values become $1..$n placeholders — never string-concatenated into SQL. */
function toParameterised(strings: TemplateStringsArray, values: unknown[]) {
  let text = strings[0]
  for (let i = 0; i < values.length; i += 1) {
    text += `$${i + 1}${strings[i + 1]}`
  }
  return { text, values }
}

function createNeonSql(connectionString: string): SqlFn {
  // `cache: "no-store"` is load-bearing, not a precaution. The Neon driver sends each query
  // as an HTTPS POST, and Next.js patches global fetch — so without this, queries land in
  // Next's on-disk fetch cache and a stale response is replayed for every later request with
  // the same SQL and parameters. That cache outlives the process and, on Vercel, the deploy.
  //
  // It broke `/api/ipa` concretely: the "is this word already transcribed?" SELECT returned a
  // cached empty result forever, so a word cached in the table kept reporting source:"model"
  // and kept re-running inference. INSERTs were being deduplicated too. The `pg` path cannot
  // hit this — a TCP socket is not fetch — which is why it only shows up against Neon.
  const query = neon(connectionString, { fetchOptions: { cache: "no-store" } })
  return <Row>(strings: TemplateStringsArray, ...values: unknown[]) =>
    query(strings, ...values) as Promise<Row[]>
}

function createPgSql(connectionString: string): SqlFn {
  // Lazily required so the Neon path never pulls node-postgres into the bundle.
  const { Pool } = require("pg") as typeof import("pg")

  // Small pool: a serverless instance handles one request at a time, and a non-Neon host
  // has no pooler in front of it.
  const pool: PgPool = new Pool({
    connectionString,
    max: 2,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    ssl: /sslmode=disable/.test(connectionString) ? undefined : { rejectUnauthorized: false },
  })

  return async <Row>(strings: TemplateStringsArray, ...values: unknown[]) => {
    const { text, values: params } = toParameterised(strings, values)
    const result = await pool.query(text, params)
    return result.rows as Row[]
  }
}

/**
 * Built on first query, not at import time. `next build` imports every route module to
 * collect page data, so connecting at module scope would make the build fail whenever
 * DATABASE_URL is absent — and it legitimately can be, e.g. a CI job that only compiles.
 * A missing variable should break requests, not builds.
 */
let cached: SqlFn | null = null

function getSql(): SqlFn {
  if (!cached) {
    const connectionString = requireConnectionString()
    cached = /\.neon\.tech(?::|\/|$)/.test(connectionString)
      ? createNeonSql(connectionString)
      : createPgSql(connectionString)
  }
  return cached
}

export const sql: SqlFn = (strings, ...values) => getSql()(strings, ...values)
