// data/bangla_dictionary_updated.csv -> word_meaning
//
// Rows are inserted in file order so the SERIAL ids line up with the word_id column in
// generated_word_ipa.csv, which load-ipa.mjs carries over.
//
// Column mapping is taken from the FastAPI loader (app/api/load_data.py:load_bangla_dictionary):
//   word -> words, pronunciation -> spelling, IPA -> ipa, language -> root_lang, class -> type
import fs from "node:fs"
import { parse } from "csv-parse"
import { copyRows } from "./lib/copy.mjs"
import { clean, dataFile, done, progress, withClient } from "./lib/db.mjs"

const COLUMNS = [
  "pageNo", "words", "number", "spelling", "meaning",
  "pos", "ipa", "root_lang", "type", "sentence", "source",
]

const file = dataFile("bangla_dictionary_updated.csv")

async function* rows() {
  const parser = fs.createReadStream(file).pipe(
    parse({ columns: true, bom: true, relax_quotes: true, skip_empty_lines: true })
  )
  for await (const row of parser) {
    // `words` is NOT NULL; a headword-less row carries no usable meaning.
    const word = clean(row.word)
    if (!word) continue
    yield [
      clean(row.pageNo),
      word,
      clean(row.number),
      clean(row.pronunciation),
      clean(row.meaning),
      clean(row.pos),
      clean(row.IPA),
      clean(row.language),
      clean(row.class),
      clean(row.sentence),
      clean(row.source),
    ]
  }
}

await withClient(async (client) => {
  console.log("Loading word_meaning from bangla_dictionary_updated.csv")
  await client.query("TRUNCATE word_meaning RESTART IDENTITY")
  const count = await copyRows(client, "word_meaning", COLUMNS, rows(), (n) => progress("rows", n))
  done("rows", count)
  console.log(`Loaded ${count.toLocaleString()} rows into word_meaning.`)
})
