// Shared plumbing for the local loader scripts. These run on your machine against the
// Neon database over a normal TCP connection (node-postgres) — not in Vercel functions —
// because the source files are hundreds of MB and loading takes minutes.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..")
export const DATA_DIR = path.join(ROOT, "data")

/** Load DATABASE_URL from .env.local / .env without pulling in a dotenv dependency. */
function loadEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const file = path.join(ROOT, name)
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i)
      if (!match) continue
      const [, key, rawValue] = match
      if (process.env[key]) continue
      process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "")
    }
  }
}

export function connectionString() {
  loadEnvFiles()
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("DATABASE_URL is not set. Put it in .env.local or export it before running.")
    process.exit(1)
  }
  return url
}

export async function withClient(fn) {
  const client = new pg.Client({ connectionString: connectionString() })
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

export function dataFile(name) {
  const file = path.join(DATA_DIR, name)
  if (!fs.existsSync(file)) {
    console.error(`Missing data file: ${file}`)
    console.error("The /data directory is gitignored — copy the source files in before loading.")
    process.exit(1)
  }
  return file
}

/** Postgres rejects NUL bytes in text; the OCR-derived sources contain a few. */
export function clean(value) {
  if (value === null || value === undefined) return null
  const stripped = String(value).replace(/\0/g, "")
  return stripped === "" ? null : stripped
}

export function progress(label, count) {
  process.stdout.write(`\r  ${label}: ${count.toLocaleString()}   `)
}

export function done(label, count) {
  process.stdout.write(`\r  ${label}: ${count.toLocaleString()}   \n`)
}
