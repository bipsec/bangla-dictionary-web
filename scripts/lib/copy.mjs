// COPY-based bulk insert. Row-by-row INSERTs over a network connection would take hours
// for the 1M+ rows these loaders push; COPY FROM STDIN streams them in one pass.
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import copyFrom from "pg-copy-streams"

/** Escape one value for COPY's default text format. */
function encodeValue(value) {
  if (value === null || value === undefined) return "\\N"
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\t/g, "\\t")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
}

function encodeRow(row) {
  return row.map(encodeValue).join("\t") + "\n"
}

/**
 * Stream rows into `table` via COPY.
 *
 * @param client   connected pg.Client
 * @param table    target table name
 * @param columns  column names, matching each row's value order
 * @param rows     async iterable of value arrays
 * @param onCount  called with the running row count
 */
export async function copyRows(client, table, columns, rows, onCount) {
  const quoted = columns.map((c) => `"${c}"`).join(", ")
  const sink = client.query(copyFrom.from(`COPY ${table} (${quoted}) FROM STDIN`))

  let count = 0
  const source = Readable.from(
    (async function* () {
      for await (const row of rows) {
        count += 1
        if (onCount && count % 20000 === 0) onCount(count)
        yield encodeRow(row)
      }
    })()
  )

  await pipeline(source, sink)
  return count
}
