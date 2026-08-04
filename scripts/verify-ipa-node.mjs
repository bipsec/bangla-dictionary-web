// Assert the Node/onnxruntime inference path reproduces the reference PyTorch outputs in
// model/parity-fixture.json (written by scripts/python/verify_ipa_onnx.py).
//
// This is the check that matters for production: it exercises the exact code the deployed
// /api/ipa route runs, with no Python involved.
//
// Requires Node >= 22.18, which strips TypeScript types natively — no extra tooling to
// import lib/server/ipa-model.ts directly (that file imports only node builtins + ort).
//
//   npm run verify:ipa
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const fixturePath = path.join(ROOT, "model", "parity-fixture.json")
if (!fs.existsSync(fixturePath)) {
  console.error(`Missing ${fixturePath}. Run scripts/python/verify_ipa_onnx.py first.`)
  process.exit(1)
}

const { cases } = JSON.parse(fs.readFileSync(fixturePath, "utf8"))
const { translateToIpa } = await import("../lib/server/ipa-model.ts")

let failures = 0
const started = Date.now()

for (const [i, testCase] of cases.entries()) {
  const actual = await translateToIpa(testCase.word)
  if (actual !== testCase.ipa) {
    failures += 1
    console.error(`MISMATCH ${testCase.word}\n  expected: ${testCase.ipa}\n  actual:   ${actual}`)
  }
  if ((i + 1) % 10 === 0) console.log(`  checked ${i + 1}/${cases.length}`)
}

const elapsed = Date.now() - started
const passed = cases.length - failures
console.log(
  `\n${passed}/${cases.length} match the PyTorch reference ` +
    `(${(elapsed / cases.length).toFixed(0)} ms/word)`
)
process.exit(failures === 0 ? 0 : 1)
