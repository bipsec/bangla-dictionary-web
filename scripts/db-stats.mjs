// Row counts and on-disk size. Worth checking against your Neon plan's storage limit
// after a full load (the free tier allows 0.5 GiB).
import { withClient } from "./lib/db.mjs"

const TABLES = ["word_meaning", "ipa", "enriched_dictionary", "pouranik_utso"]

await withClient(async (client) => {
  for (const table of TABLES) {
    const [{ count }] = (await client.query(`SELECT COUNT(*)::int AS count FROM ${table}`)).rows
    const [{ size }] = (
      await client.query(`SELECT pg_size_pretty(pg_total_relation_size($1)) AS size`, [table])
    ).rows
    console.log(`${table.padEnd(22)} ${String(count).padStart(10)} rows   ${size}`)
  }

  const [{ total }] = (
    await client.query(`SELECT pg_size_pretty(pg_database_size(current_database())) AS total`)
  ).rows
  console.log(`\ndatabase total: ${total}`)
})
