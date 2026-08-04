// data/pouranik_uthsho_parsed.json -> pouranik_utso
//
// Port of app/api/load_data.py:load_pouranik_utso. This file is only ~1.3 MB, so it is
// read in one go rather than streamed.
import fs from "node:fs"
import { copyRows } from "./lib/copy.mjs"
import { clean, dataFile, done, withClient } from "./lib/db.mjs"

const COLUMNS = ["word", "description"]

const data = JSON.parse(fs.readFileSync(dataFile("pouranik_uthsho_parsed.json"), "utf8"))
const entries = data.entries ?? []

// `word` and `description` are both NOT NULL, so skip entries missing either.
let skipped = 0
const rows = []
for (const entry of entries) {
  const word = clean(entry.word)
  const description = clean(entry.description)
  if (!word || !description) {
    skipped += 1
    continue
  }
  rows.push([word, description])
}

await withClient(async (client) => {
  console.log("Loading pouranik_utso from pouranik_uthsho_parsed.json")
  await client.query("TRUNCATE pouranik_utso RESTART IDENTITY")
  const count = await copyRows(client, "pouranik_utso", COLUMNS, rows)
  done("rows", count)
  console.log(`Loaded ${count.toLocaleString()} rows into pouranik_utso (skipped ${skipped}).`)
})
