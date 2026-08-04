// data/generated_word_ipa.csv -> ipa
//
// word_id refers to word_meaning.id, so run load-dictionary.mjs first. The column is not
// a foreign key (see sql/schema.sql) and nothing in the read path joins on it.
import fs from "node:fs"
import { parse } from "csv-parse"
import { copyRows } from "./lib/copy.mjs"
import { clean, dataFile, done, progress, withClient } from "./lib/db.mjs"

const COLUMNS = ["words", "ipa", "word_meaning_id"]

const file = dataFile("generated_word_ipa.csv")

async function* rows() {
  const parser = fs.createReadStream(file).pipe(
    parse({ columns: true, bom: true, relax_quotes: true, skip_empty_lines: true })
  )
  for await (const row of parser) {
    const word = clean(row.word)
    if (!word) continue
    const wordId = Number.parseInt(row.word_id ?? "", 10)
    yield [word, clean(row.ipa), Number.isFinite(wordId) ? wordId : null]
  }
}

await withClient(async (client) => {
  console.log("Loading ipa from generated_word_ipa.csv")
  await client.query("TRUNCATE ipa RESTART IDENTITY")
  const count = await copyRows(client, "ipa", COLUMNS, rows(), (n) => progress("rows", n))
  done("rows", count)
  console.log(`Loaded ${count.toLocaleString()} rows into ipa.`)
})
