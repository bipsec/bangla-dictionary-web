// data/enriched_all.json -> enriched_dictionary
//
// Direct port of app/api/load_data.py:load_complete_dictionary from the FastAPI service,
// including the one-row-per-meaning fan-out, the Bangla source-name map, and NUL stripping.
// The file is ~210 MB, so entries are streamed with stream-json rather than JSON.parse'd.
import fs from "node:fs"
import StreamChain from "stream-chain"
import StreamJsonParser from "stream-json"
import Pick from "stream-json/filters/Pick.js"
import StreamArray from "stream-json/streamers/StreamArray.js"
import { copyRows } from "./lib/copy.mjs"
import { clean, dataFile, done, progress, withClient } from "./lib/db.mjs"

const { chain } = StreamChain
const { parser } = StreamJsonParser
const { pick } = Pick
const { streamArray } = StreamArray

const COLUMNS = [
  "word", "pronunciation", "pos", "pos_full", "ipa", "root_lang", "topic_marker",
  "female_marker", "antonyms", "rhyme_words", "english", "pouranic_source",
  "meaning", "example", "synonyms", "page_no", "source",
]

// Internal dictionary keys -> the Bangla display names the UI renders as source badges.
const SOURCE_NAMES = {
  accessible_ovidhan: "অভিগম্য অভিধান",
  bangla_academy_ovidhan: "বাংলা একাডেমি অভিধান",
  bangla_banan_ovidhan: "বাংলা বানান অভিধান",
  bangla_uccharon_ovidhan: "বাংলা উচ্চারণ অভিধান",
  beboharik_bangla_ovidhan: "ব্যবহারিক বাংলা অভিধান",
  bibartanmulak_ovidhan: "বিবর্তনমূলক বাংলা অভিধান",
  online_eb_ovidhan: "এনসাইক্লোপিডিয়া বাংলা অভিধান",
  samkshipta_bangla_abhidhan: "সংক্ষিপ্ত বাংলা অভিধান",
  samsad_ovidhan: "সংসদ বাংলা অভিধান",
  samarthoshabdokosh: "সমার্থশব্দকোষ",
  antomil_ovidhan: "অন্তমিল অভিধান",
  pouranik_uthsho: "পৌরাণিক উৎস",
}

/** Nested `{value: ...}` accessor used throughout the enriched format. */
function value(node) {
  return node && typeof node === "object" ? clean(node.value) : null
}

function jsonList(list) {
  return Array.isArray(list) && list.length > 0 ? clean(JSON.stringify(list)) : null
}

/** One entry becomes one row per meaning (or a single row when it has no meanings). */
function buildRows(entry) {
  const englishValues = (entry.english ?? [])
    .map((item) => item?.value)
    .filter((v) => typeof v === "string" && v !== "")

  const shared = [
    clean(entry.word) ?? "",
    value(entry.pronunciation),
    value(entry.pos),
    entry.pos && typeof entry.pos === "object" ? clean(entry.pos.full_form) : null,
    value(entry.ipa),
    value(entry.origin),
    value(entry.topic_marker),
    value(entry.female_marker),
    jsonList(entry.antonyms?.words),
    jsonList(entry.rhyme_words?.words),
    jsonList(englishValues),
    entry.pouranic_source ? clean(entry.pouranic_source.description) : null,
  ]

  const meanings = entry.meanings ?? []
  if (meanings.length === 0) {
    return [[...shared, null, null, null, null, null]]
  }

  return meanings.map((meaning) => {
    const source = meaning.source ?? {}
    const rawDict = source.dict ?? ""
    return [
      ...shared,
      clean((meaning.definitions ?? []).join("; ")),
      clean(meaning.example),
      jsonList(meaning.synonyms),
      clean(source.page === null || source.page === undefined ? "" : String(source.page)),
      clean(SOURCE_NAMES[rawDict] ?? rawDict),
    ]
  })
}

const file = dataFile("enriched_all.json")

async function* rows() {
  const pipeline = chain([
    fs.createReadStream(file),
    parser(),
    pick({ filter: "entries" }),
    streamArray(),
  ])
  for await (const { value: entry } of pipeline) {
    yield* buildRows(entry)
  }
}

await withClient(async (client) => {
  console.log("Loading enriched_dictionary from enriched_all.json (this takes a while)")
  await client.query("TRUNCATE enriched_dictionary RESTART IDENTITY")
  const count = await copyRows(client, "enriched_dictionary", COLUMNS, rows(), (n) =>
    progress("rows", n)
  )
  done("rows", count)
  console.log(`Loaded ${count.toLocaleString()} rows into enriched_dictionary.`)
})
