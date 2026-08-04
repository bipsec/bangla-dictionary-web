/**
 * Regression gate for the backend port.
 *
 * Runs every new Next.js route side by side with the FastAPI endpoint it replaces, against
 * the same database, and deep-compares the JSON. The point is to prove the SQL translation
 * is faithful before the Python service is retired.
 *
 *   REFERENCE_URL=http://127.0.0.1:8021 TARGET_URL=http://127.0.0.1:3021 node scripts/smoke.mjs
 *
 * Without REFERENCE_URL the script still runs, but only checks each new route responds with
 * a sane shape — it cannot prove equivalence. It says so in the output.
 */

import { withClient } from "./lib/db.mjs"

const TARGET = (process.env.TARGET_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "")
const REFERENCE = process.env.REFERENCE_URL?.replace(/\/$/, "") ?? null

/**
 * Cases pair a new route with the old one. Two knobs describe intended differences:
 *
 * - `unordered`   compare as a set, where the old query left row order undefined
 * - `idsMayDiffer` compare only the `word` values, where the old query picked an arbitrary
 *                  row among duplicates so the `id` it returned was not deterministic
 *
 * Anything else that differs is a failure. Deviations that change status codes live in
 * DEVIATIONS below, where the new behaviour is asserted rather than merely tolerated.
 */
const CASES = [
  // ---- /dictionary/words: letter prefix listing, pagination, limit clamping ----
  ...["অ", "ক", "স", "ব"].map((letter) => ({
    name: `dictionary/words letter=${letter}`,
    target: `/api/dictionary/words?letter=${encodeURIComponent(letter)}&page=1&limit=20`,
    reference: `/dictionary/words?letter=${encodeURIComponent(letter)}&page=1&limit=20`,
    // The Python query paginated an unordered DISTINCT, so rows could repeat or vanish
    // between pages. The port adds ORDER BY id; compare as a set to allow for that.
    unordered: true,
  })),
  {
    name: "dictionary/words page=2",
    target: "/api/dictionary/words?letter=%E0%A6%95&page=2&limit=20",
    reference: "/dictionary/words?letter=%E0%A6%95&page=2&limit=20",
    unordered: true,
  },
  {
    name: "dictionary/words no results",
    target: "/api/dictionary/words?letter=zzz&page=1&limit=20",
    reference: "/dictionary/words?letter=zzz&page=1&limit=20",
  },

  // ---- /dictionary/word: detail with multiple meanings ----
  ...["অ", "কর", "জল", "মন"].map((word) => ({
    name: `dictionary/word word=${word}`,
    target: `/api/dictionary/word?word=${encodeURIComponent(word)}`,
    reference: `/dictionary/word?word=${encodeURIComponent(word)}`,
  })),
  {
    name: "dictionary/word page=2",
    target: "/api/dictionary/word?word=%E0%A6%95%E0%A6%B0&page=2&limit=3",
    reference: "/dictionary/word?word=%E0%A6%95%E0%A6%B0&page=2&limit=3",
  },
  {
    name: "dictionary/word missing word",
    target: "/api/dictionary/word?word=zzznotaword",
    reference: "/dictionary/word?word=zzznotaword",
  },

  // ---- /complete-dictionary ----
  // DISTINCT ON (word) with no tiebreaker: which duplicate row's id came back was up to
  // Postgres. The port adds `ORDER BY word, id` to make it deterministic, so ids can differ
  // from the old response while the word list — the only thing the UI uses — is identical.
  ...["অ", "ক", "স", "ব", "প"].map((letter) => ({
    name: `complete-dictionary/words letter=${letter}`,
    target: `/api/complete-dictionary/words?letter=${encodeURIComponent(letter)}&page=1&limit=10`,
    reference: `/complete-dictionary/words?letter=${encodeURIComponent(letter)}&page=1&limit=10`,
    idsMayDiffer: true,
  })),
  {
    name: "complete-dictionary/words page=3",
    target: "/api/complete-dictionary/words?letter=%E0%A6%95&page=3&limit=10",
    reference: "/complete-dictionary/words?letter=%E0%A6%95&page=3&limit=10",
    idsMayDiffer: true,
  },
  ...["অ", "কর", "জল"].map((word) => ({
    name: `complete-dictionary/word word=${word}`,
    target: `/api/complete-dictionary/word?word=${encodeURIComponent(word)}`,
    reference: `/complete-dictionary/word?word=${encodeURIComponent(word)}`,
  })),
  {
    name: "complete-dictionary/word 404",
    target: "/api/complete-dictionary/word?word=zzznotaword",
    reference: "/complete-dictionary/word?word=zzznotaword",
  },

  // ---- /pouranik-utso ----
  ...["অ", "ক", "স"].map((letter) => ({
    name: `pouranik-utso/words letter=${letter}`,
    target: `/api/pouranik-utso/words?letter=${encodeURIComponent(letter)}&page=1&limit=10`,
    reference: `/pouranik-utso/words?letter=${encodeURIComponent(letter)}&page=1&limit=10`,
  })),
  {
    name: "pouranik-utso/words no results",
    target: "/api/pouranik-utso/words?letter=zzz&page=1&limit=10",
    reference: "/pouranik-utso/words?letter=zzz&page=1&limit=10",
  },
  {
    name: "pouranik-utso/word 404",
    target: "/api/pouranik-utso/word?word=zzznotaword",
    reference: "/pouranik-utso/word?word=zzznotaword",
  },
]

/** Words that are in the database: these exercise the lookup path. */
const IPA_DB_CASES = ["অ", "কর", "জল", "মন", "বাংলা", "অভিধান"]

/**
 * Invented words, chosen so the model has to run. The reference must be asked first: the
 * new route caches inferred results into `ipa`, which would turn the old API's next lookup
 * into a DB hit and quietly stop testing PyTorch at all.
 */
const IPA_MODEL_CASES = [
  "ঝিকিমিকিয়ানো",
  "ফুরফুরিয়া",
  "খচমচানি",
  "ট্রান্সফর্মার",
  "প্রত্যুৎপন্নমতি",
  "ঙঁঢ়ৎক",
]

/**
 * Intentional behaviour changes, asserted so they stay intentional. FastAPI's Query(ge/le)
 * rejected out-of-range pagination with 422; the port clamps to the same bounds instead,
 * which is friendlier for an API that is now only ever called by this app's own pages.
 */
const DEVIATIONS = [
  {
    name: "limit above the cap clamps to 500 (old API: 422)",
    path: "/api/dictionary/words?letter=%E0%A6%95&page=1&limit=9999",
    check: (body) => (Array.isArray(body) && body.length <= 500 ? null : "expected at most 500 rows"),
  },
  {
    name: "page below 1 clamps to 1 (old API: 422)",
    path: "/api/dictionary/words?letter=%E0%A6%95&page=0&limit=5",
    expectSameAs: "/api/dictionary/words?letter=%E0%A6%95&page=1&limit=5",
  },
  {
    name: "non-numeric limit falls back to the default (old API: 422)",
    path: "/api/dictionary/words?letter=%E0%A6%95&limit=abc",
    expectSameAs: "/api/dictionary/words?letter=%E0%A6%95&limit=10",
  },
  {
    name: "multi-word IPA input is transcribed per word (old API: one long token)",
    path: "/api/ipa?word=%E0%A6%9C%E0%A6%B2%20%E0%A6%AE%E0%A6%A8",
    check: (body) =>
      typeof body?.ipa === "string" && body.ipa.includes(" ") ? null : "expected a space-joined result",
  },
]

async function fetchJson(base, path) {
  const res = await fetch(base + path)
  let body = null
  try {
    body = await res.json()
  } catch {
    body = null
  }
  return { status: res.status, body }
}

/** Normalise a body for comparison according to a case's declared tolerances. */
function canonical(value, { unordered, idsMayDiffer } = {}) {
  let out = value
  if (idsMayDiffer && Array.isArray(out)) {
    out = out.map((row) => (row && typeof row === "object" ? { word: row.word } : row))
  }
  if (unordered && Array.isArray(out)) {
    return [...out].map((v) => JSON.stringify(v)).sort()
  }
  return out
}

function diff(a, b, path = "") {
  if (a === b) return null
  if (typeof a !== typeof b || a === null || b === null) {
    return `${path || "<root>"}: ${JSON.stringify(a)} !== ${JSON.stringify(b)}`
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return `${path}: array vs non-array`
    if (a.length !== b.length) return `${path}: length ${a.length} !== ${b.length}`
    for (let i = 0; i < a.length; i += 1) {
      const d = diff(a[i], b[i], `${path}[${i}]`)
      if (d) return d
    }
    return null
  }
  if (typeof a === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const key of keys) {
      const d = diff(a[key], b[key], path ? `${path}.${key}` : key)
      if (d) return d
    }
    return null
  }
  return `${path}: ${JSON.stringify(a)} !== ${JSON.stringify(b)}`
}

/**
 * A previous run cached its inferred transcriptions, which would make this run's "model"
 * cases silently take the lookup path instead. Delete just those rows so the model really
 * runs. Only touches the invented words above, never loaded data.
 */
async function clearIpaCache() {
  try {
    await withClient(async (client) => {
      const result = await client.query("DELETE FROM ipa WHERE words = ANY($1::text[])", [
        IPA_MODEL_CASES,
      ])
      if (result.rowCount > 0) {
        console.log(`cleared ${result.rowCount} cached IPA row(s) so the model path is exercised\n`)
      }
    })
  } catch (error) {
    console.warn(`warning: could not clear the IPA cache (${error.message}).`)
    console.warn("Model-path cases may report source=db instead of source=model.\n")
  }
}

let passed = 0
const failures = []

async function run() {
  console.log(`target:    ${TARGET}`)
  console.log(REFERENCE ? `reference: ${REFERENCE}\n` : "reference: (none — shape checks only)\n")

  const health = await fetchJson(TARGET, "/api/health")
  if (health.status !== 200) {
    console.error(`FATAL: ${TARGET}/api/health returned ${health.status}. Is the server up?`)
    process.exit(1)
  }

  await clearIpaCache()

  for (const testCase of CASES) {
    const got = await fetchJson(TARGET, testCase.target)

    if (!REFERENCE) {
      const ok = got.status === 200 || got.status === 404
      if (ok) passed += 1
      else failures.push(`${testCase.name}: status ${got.status}`)
      continue
    }

    const want = await fetchJson(REFERENCE, testCase.reference)

    if (got.status !== want.status) {
      failures.push(`${testCase.name}: status ${got.status} !== ${want.status}`)
      continue
    }

    const d = diff(canonical(got.body, testCase), canonical(want.body, testCase))
    if (d) failures.push(`${testCase.name}: ${d}`)
    else passed += 1
  }

  // IPA. Both paths must produce identical transcriptions: the DB lookup trivially, and the
  // model path because the ONNX graph is meant to reproduce PyTorch token for token.
  for (const [word, expectSource] of [
    ...IPA_DB_CASES.map((w) => [w, "db"]),
    ...IPA_MODEL_CASES.map((w) => [w, "model"]),
  ]) {
    // Reference first — see the IPA_MODEL_CASES comment about cache write-back.
    const want = REFERENCE
      ? await fetchJson(REFERENCE, `/get_ipa/?word=${encodeURIComponent(word)}`)
      : null
    const got = await fetchJson(TARGET, `/api/ipa?word=${encodeURIComponent(word)}`)

    if (got.status !== 200) {
      failures.push(`ipa word=${word}: status ${got.status}`)
      continue
    }
    if (got.body?.source !== expectSource) {
      failures.push(`ipa word=${word}: source ${got.body?.source} !== ${expectSource}`)
      continue
    }
    if (want && got.body?.ipa !== want.body?.ipa) {
      failures.push(
        `ipa word=${word}: ${JSON.stringify(got.body?.ipa)} !== ${JSON.stringify(want.body?.ipa)}`
      )
      continue
    }

    // A model-path word must come back as a DB hit on the very next request. This is not a
    // nicety: the Neon driver tunnels SQL over HTTPS, so a caching layer that intercepts fetch
    // can serve a stale empty SELECT and make the write-back unreadable — leaving the model to
    // re-run on every request forever. Asserting source=model alone does not catch that.
    if (expectSource === "model") {
      const again = await fetchJson(TARGET, `/api/ipa?word=${encodeURIComponent(word)}`)
      if (again.body?.source !== "db") {
        failures.push(
          `ipa word=${word}: write-back not read back — second request reported ` +
            `source=${again.body?.source}, expected db (inference would repeat indefinitely)`
        )
        continue
      }
      if (again.body?.ipa !== got.body?.ipa) {
        failures.push(
          `ipa word=${word}: cached ${JSON.stringify(again.body?.ipa)} !== ` +
            `inferred ${JSON.stringify(got.body?.ipa)}`
        )
        continue
      }
    }

    passed += 1
  }

  // Deviations are checked against the new behaviour only — the old API 422s on these.
  for (const deviation of DEVIATIONS) {
    const got = await fetchJson(TARGET, deviation.path)
    if (got.status !== 200) {
      failures.push(`deviation "${deviation.name}": status ${got.status}`)
      continue
    }
    if (deviation.expectSameAs) {
      const baseline = await fetchJson(TARGET, deviation.expectSameAs)
      const d = diff(got.body, baseline.body)
      if (d) failures.push(`deviation "${deviation.name}": ${d}`)
      else passed += 1
      continue
    }
    const problem = deviation.check(got.body)
    if (problem) failures.push(`deviation "${deviation.name}": ${problem}`)
    else passed += 1
  }

  const total = passed + failures.length
  console.log(`${passed}/${total} passed`)
  if (failures.length > 0) {
    console.log("\nfailures:")
    for (const failure of failures) console.log(`  - ${failure}`)
    process.exit(1)
  }
  console.log(REFERENCE ? "\nAll responses match the reference API." : "\nAll routes responded.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
