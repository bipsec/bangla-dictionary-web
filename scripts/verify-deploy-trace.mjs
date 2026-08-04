/**
 * Guards the IPA route's deployed file set.
 *
 * Vercel ships only the files its bundler traced, and two things the route needs at runtime
 * are invisible to that analysis: model/** (read through fs) and onnxruntime's wasm backend
 * (loaded by dynamic path). Both are declared in next.config.js under
 * outputFileTracingIncludes. If either declaration is dropped or a dependency upgrade renames
 * a file, the build still succeeds and the route still deploys — it just fails on the first
 * word that misses the database cache. That is a bad failure to discover in production.
 *
 * This copies the traced set to a scratch directory and runs a real inference there, so the
 * check exercises exactly what would be deployed rather than what happens to be in the repo.
 *
 *   npm run build && node scripts/verify-deploy-trace.mjs
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const TRACE = path.join(ROOT, ".next", "server", "app", "api", "ipa", "route.js.nft.json")

if (!fs.existsSync(TRACE)) {
  console.error(`No trace file at ${path.relative(ROOT, TRACE)}.`)
  console.error("Run `npm run build` first.")
  process.exit(1)
}

const traced = JSON.parse(fs.readFileSync(TRACE, "utf8")).files.map((rel) =>
  path.resolve(path.dirname(TRACE), rel)
)

/** Runtime files the bundler cannot discover on its own. */
const REQUIRED = [
  "model/ipa_model.onnx",
  "model/src_vocab.json",
  "model/trg_vocab.json",
  "model/config.json",
  "node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
  "node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs",
]

const tracedSet = new Set(traced.map((file) => path.relative(ROOT, file).replace(/\\/g, "/")))
const missing = REQUIRED.filter((rel) => !tracedSet.has(rel))

if (missing.length > 0) {
  console.error("These runtime files are NOT in the deployed trace:")
  for (const rel of missing) console.error(`  - ${rel}`)
  console.error("\nAdd them to experimental.outputFileTracingIncludes in next.config.js.")
  process.exit(1)
}
console.log(`All ${REQUIRED.length} runtime files are traced.`)

// Copy the traced set somewhere isolated, so nothing can be satisfied from the real tree.
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "ipa-deploy-"))
let bytes = 0
for (const file of traced) {
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) continue
  const dest = path.join(sandbox, path.relative(ROOT, file))
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(file, dest)
  bytes += fs.statSync(file).size
}
console.log(`Function payload: ${(bytes / 1048576).toFixed(1)} MB (Vercel limit: 250 MB).`)

const runner = `
import fs from "node:fs/promises"
import path from "node:path"
import * as ort from "onnxruntime-web"
ort.env.wasm.numThreads = 1
ort.env.logLevel = "error"
const dir = path.join(process.cwd(), "model")
const [bytes, src, trg, cfg] = await Promise.all([
  fs.readFile(path.join(dir, "ipa_model.onnx")),
  fs.readFile(path.join(dir, "src_vocab.json"), "utf8").then(JSON.parse),
  fs.readFile(path.join(dir, "trg_vocab.json"), "utf8").then(JSON.parse),
  fs.readFile(path.join(dir, "config.json"), "utf8").then(JSON.parse),
])
const session = await ort.InferenceSession.create(bytes, { executionProviders: ["wasm"] })
const pad = (ix, p) => {
  const o = new BigInt64Array(cfg.seq_len).fill(BigInt(p))
  ix.forEach((v, i) => { o[i] = BigInt(v) })
  return o
}
const word = process.argv[2]
const toks = Array.from(word)
const si = [src.stoi["<sos>"], ...toks.map((t) => src.stoi[t] ?? src.stoi["<unk>"]), src.stoi["<eos>"]]
const st = new ort.Tensor("int64", pad(si, cfg.src_pad_idx), [cfg.seq_len, 1])
const eos = trg.stoi["<eos>"], unk = trg.stoi["<unk>"] ?? -1, V = trg.itos.length
const dec = [trg.stoi["<sos>"]]
for (let s = 0; s < Math.min(cfg.max_decode_steps, 3 * toks.length + 10); s += 1) {
  const out = await session.run({ src: st, trg: new ort.Tensor("int64", pad(dec, cfg.trg_pad_idx), [cfg.seq_len, 1]) })
  const lg = out.logits.data, off = (dec.length - 1) * V
  let b = 0, bs = -Infinity
  for (let i = 0; i < V; i += 1) if (lg[off + i] > bs) { bs = lg[off + i]; b = i }
  if (b === unk) continue
  dec.push(b)
  if (b === eos) break
}
process.stdout.write(dec.slice(1).filter((i) => i !== eos && i !== unk).map((i) => trg.itos[i]).join(" "))
`
fs.writeFileSync(path.join(sandbox, "run.mjs"), runner)

// Compare against a transcription the PyTorch parity check already signed off on.
const fixture = JSON.parse(fs.readFileSync(path.join(ROOT, "model", "parity-fixture.json"), "utf8"))
const { word, ipa: expected } = fixture.cases?.[0] ?? {}
if (!word) {
  console.error("model/parity-fixture.json has no cases; cannot check correctness.")
  process.exit(1)
}

const { execFileSync } = await import("node:child_process")
let actual
try {
  actual = execFileSync(process.execPath, ["run.mjs", word], {
    cwd: sandbox,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim()
} catch (error) {
  console.error("\nInference FAILED using only the deployed files:\n")
  console.error(error.stderr || error.message)
  console.error("This is what would happen on Vercel for any word not already cached.")
  process.exit(1)
}

if (actual !== expected) {
  console.error(`\nWrong transcription for "${word}":`)
  console.error(`  expected: ${expected}`)
  console.error(`  actual:   ${actual}`)
  process.exit(1)
}

fs.rmSync(sandbox, { recursive: true, force: true })
console.log(`Inference from the deployed files only: "${word}" -> ${actual}`)
console.log("\nThe IPA route will work on Vercel.")
