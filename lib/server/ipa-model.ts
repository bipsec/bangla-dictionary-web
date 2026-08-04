import fs from "node:fs/promises"
import path from "node:path"
import * as ort from "onnxruntime-web"

/**
 * Bangla → IPA inference in Node.
 *
 * The model was trained in PyTorch; scripts/python/export_ipa_onnx.py converts it to
 * model/ipa_model.onnx, and scripts/python/verify_ipa_onnx.py proves this decode loop's
 * Python twin reproduces the original outputs exactly. The graph has a fixed sequence
 * length (see the SEQ_LEN comment in the export script), so inputs are padded here.
 */

interface Vocab {
  itos: string[]
  stoi: Record<string, number>
}

interface ModelConfig {
  seq_len: number
  max_decode_steps: number
  src_pad_idx: number
  trg_pad_idx: number
}

interface LoadedModel {
  session: ort.InferenceSession
  src: Vocab
  trg: Vocab
  config: ModelConfig
}

// The WASM backend is the only one that runs in a serverless Node process without a
// native binary. Single-threaded: Vercel functions get no SharedArrayBuffer worker pool.
ort.env.wasm.numThreads = 1
ort.env.wasm.simd = true
ort.env.logLevel = "error"

const MODEL_DIR = path.join(process.cwd(), "model")

// Kept at module scope so a warm invocation reuses the session instead of re-reading 22MB.
let modelPromise: Promise<LoadedModel> | null = null

async function readJson<T>(name: string): Promise<T> {
  return JSON.parse(await fs.readFile(path.join(MODEL_DIR, name), "utf8")) as T
}

async function loadModel(): Promise<LoadedModel> {
  const [modelBytes, src, trg, config] = await Promise.all([
    fs.readFile(path.join(MODEL_DIR, "ipa_model.onnx")),
    readJson<Vocab>("src_vocab.json"),
    readJson<Vocab>("trg_vocab.json"),
    readJson<ModelConfig>("config.json"),
  ])

  const session = await ort.InferenceSession.create(modelBytes, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
  })

  return { session, src, trg, config }
}

export function getModel(): Promise<LoadedModel> {
  if (!modelPromise) {
    modelPromise = loadModel().catch((cause) => {
      // Don't cache a failed load; the next request gets a fresh attempt.
      modelPromise = null
      throw cause
    })
  }
  return modelPromise
}

/** One token per character — matches `_tokenize` in the original ipa_converter.py. */
function tokenize(word: string): string[] {
  return Array.from(word)
}

function padded(indices: number[], padIdx: number, seqLen: number): BigInt64Array {
  const out = new BigInt64Array(seqLen).fill(BigInt(padIdx))
  for (let i = 0; i < indices.length; i += 1) out[i] = BigInt(indices[i])
  return out
}

/** Longest input the exported graph accepts, allowing for <sos> and <eos>. */
export function maxWordLength(config: ModelConfig): number {
  return config.seq_len - 2
}

/**
 * Greedy decode, a direct port of BanglaIPATranslator.translate: take the argmax at each
 * step, skip <unk> predictions without consuming a step's output, stop at <eos>.
 * Returns null when the word is longer than the exported graph supports.
 */
export async function translateToIpa(word: string): Promise<string | null> {
  const { session, src, trg, config } = await getModel()

  const tokens = tokenize(word)
  if (tokens.length > maxWordLength(config)) return null

  const unkSrc = src.stoi["<unk>"] ?? 0
  const srcIndices = [
    src.stoi["<sos>"],
    ...tokens.map((token) => src.stoi[token] ?? unkSrc),
    src.stoi["<eos>"],
  ]
  const srcTensor = new ort.Tensor(
    "int64",
    padded(srcIndices, config.src_pad_idx, config.seq_len),
    [config.seq_len, 1]
  )

  const sosIdx = trg.stoi["<sos>"]
  const eosIdx = trg.stoi["<eos>"]
  const unkIdx = trg.stoi["<unk>"] ?? -1
  const vocabSize = trg.itos.length

  const decoded: number[] = [sosIdx]
  // Cap steps by input length rather than always running the full 60 (the Python default):
  // an IPA transcription is never much longer than its input, so this trims worst-case CPU.
  const maxSteps = Math.min(config.max_decode_steps, 3 * tokens.length + 10)

  for (let step = 0; step < maxSteps; step += 1) {
    const trgTensor = new ort.Tensor(
      "int64",
      padded(decoded, config.trg_pad_idx, config.seq_len),
      [config.seq_len, 1]
    )

    const output = await session.run({ src: srcTensor, trg: trgTensor })
    const logits = output.logits.data as Float32Array

    // logits is (seq_len, batch=1, vocab); the newest prediction sits at the last real step.
    const rowStart = (decoded.length - 1) * vocabSize
    let best = 0
    let bestScore = Number.NEGATIVE_INFINITY
    for (let i = 0; i < vocabSize; i += 1) {
      const score = logits[rowStart + i]
      if (score > bestScore) {
        bestScore = score
        best = i
      }
    }

    if (best === unkIdx) continue
    decoded.push(best)
    if (best === eosIdx) break
    if (decoded.length >= config.seq_len) break
  }

  return decoded
    .slice(1)
    .filter((index) => index !== eosIdx && index !== unkIdx)
    .map((index) => trg.itos[index])
    .join(" ")
}
