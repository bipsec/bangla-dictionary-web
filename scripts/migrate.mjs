// Apply sql/schema.sql. Idempotent — every statement is CREATE ... IF NOT EXISTS.
import fs from "node:fs"
import path from "node:path"
import { ROOT, withClient } from "./lib/db.mjs"

const schema = fs.readFileSync(path.join(ROOT, "sql", "schema.sql"), "utf8")

await withClient(async (client) => {
  await client.query(schema)
  const { rows } = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `)
  console.log("Schema applied. Tables:", rows.map((r) => r.table_name).join(", "))
})
