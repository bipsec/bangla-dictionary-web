"""Confirm the exported ONNX model reproduces the original PyTorch model exactly.

The reference side runs the *unmodified* architecture from bang-dict-api with
variable-length inputs — exactly what the old /get_ipa endpoint did. The candidate side
runs model/ipa_model.onnx at its fixed SEQ_LEN with padding. Requiring identical greedy
decodes proves both the ONNX conversion and the padding scheme are faithful.

The exported model is not trustworthy until this reports 100%.

    .venv-export/Scripts/python.exe scripts/python/verify_ipa_onnx.py
"""

import argparse
import csv
import json
import pathlib
import random
import sys

import numpy as np
import onnxruntime as ort
import torch

from export_ipa_onnx import DEFAULT_API_ROOT, SEQ_LEN, WEB_ROOT, build_model

MAX_DECODE_STEPS = 60


def tokenize(word: str) -> list[str]:
    """Same tokenizer as the original service: one token per character."""
    return list(" ".join(word).split(" "))


def encode_src(tokens: list[str], stoi: dict) -> np.ndarray:
    unk = stoi.get("<unk>", 0)
    indices = [stoi["<sos>"]] + [stoi.get(t, unk) for t in tokens] + [stoi["<eos>"]]
    return np.array(indices, dtype=np.int64).reshape(-1, 1)


def greedy_decode(step_fn, src: np.ndarray, trg_stoi: dict, trg_itos: list[str]) -> str:
    """Greedy decode loop copied from ipa_converter.BanglaIPATranslator.translate.

    `step_fn(src, trg)` returns logits shaped (trg_len, batch, vocab); the caller is
    responsible for telling it which position holds the newest prediction, so this loop
    works for both the variable-length and the padded runtime.
    """
    sos_idx = trg_stoi["<sos>"]
    eos_idx = trg_stoi["<eos>"]
    unk_idx = trg_stoi.get("<unk>", -1)

    trg_indices = [sos_idx]
    for _ in range(MAX_DECODE_STEPS):
        logits = step_fn(src, np.array(trg_indices, dtype=np.int64).reshape(-1, 1))
        pred_idx = int(logits[len(trg_indices) - 1, 0].argmax())
        if pred_idx == unk_idx:
            continue
        trg_indices.append(pred_idx)
        if pred_idx == eos_idx:
            break

    return " ".join(trg_itos[i] for i in trg_indices[1:] if i not in (eos_idx, unk_idx))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--api-root", type=pathlib.Path, default=DEFAULT_API_ROOT)
    parser.add_argument("--model-dir", type=pathlib.Path, default=WEB_ROOT / "model")
    parser.add_argument("--samples", type=int, default=300)
    parser.add_argument("--seed", type=int, default=20260804)
    args = parser.parse_args()

    torch_model, src_vocab, trg_vocab = build_model(args.api_root / "app" / "model")
    session = ort.InferenceSession(str(args.model_dir / "ipa_model.onnx"),
                                   providers=["CPUExecutionProvider"])

    src_pad = src_vocab["stoi"]["<pad>"]
    trg_pad = trg_vocab["stoi"]["<pad>"]

    def torch_step(src, trg):
        """Reference: the original model, variable-length, exactly as the old API ran it."""
        with torch.no_grad():
            out = torch_model(torch.from_numpy(src), torch.from_numpy(trg))
        return out.numpy()

    def pad_to(seq: np.ndarray, pad_value: int) -> np.ndarray:
        if seq.shape[0] > SEQ_LEN:
            raise ValueError(f"sequence of {seq.shape[0]} exceeds exported SEQ_LEN={SEQ_LEN}")
        padding = np.full((SEQ_LEN - seq.shape[0], 1), pad_value, dtype=np.int64)
        return np.concatenate([seq, padding], axis=0)

    def onnx_step(src, trg):
        """Candidate: the exported graph, fixed length, inputs padded."""
        return session.run(
            ["logits"], {"src": pad_to(src, src_pad), "trg": pad_to(trg, trg_pad)}
        )[0]

    # Sample real headwords so the check covers the input distribution the API sees.
    csv_path = WEB_ROOT / "data" / "generated_word_ipa.csv"
    if not csv_path.exists():
        print(f"error: {csv_path} not found (the /data directory is gitignored)", file=sys.stderr)
        return 1

    with open(csv_path, encoding="utf-8", newline="") as f:
        words = [row["word"] for row in csv.DictReader(f) if row.get("word")]

    random.seed(args.seed)
    sample = random.sample(words, min(args.samples, len(words)))

    mismatches = []
    for i, word in enumerate(sample, 1):
        src = encode_src(tokenize(word), src_vocab["stoi"])
        expected = greedy_decode(torch_step, src, trg_vocab["stoi"], trg_vocab["itos"])
        actual = greedy_decode(onnx_step, src, trg_vocab["stoi"], trg_vocab["itos"])
        if expected != actual:
            mismatches.append((word, expected, actual))
        if i % 25 == 0:
            print(f"  checked {i}/{len(sample)} ({len(mismatches)} mismatches)")

    matched = len(sample) - len(mismatches)
    print(f"\n{matched}/{len(sample)} exact matches "
          f"({100 * matched / len(sample):.2f}%)")

    if mismatches:
        print("\nMismatches:")
        for word, expected, actual in mismatches[:20]:
            print(f"  {word!r}\n    torch: {expected!r}\n    onnx : {actual!r}")
        return 1

    # Also dump a fixture the Node-side test can assert against.
    fixture = args.model_dir / "parity-fixture.json"
    fixture_words = sample[:40]
    with open(fixture, "w", encoding="utf-8") as f:
        json.dump(
            {
                "note": "Reference PyTorch outputs; scripts/verify-ipa-node.mjs asserts the "
                        "Node runtime reproduces these.",
                "cases": [
                    {
                        "word": w,
                        "ipa": greedy_decode(
                            torch_step, encode_src(tokenize(w), src_vocab["stoi"]),
                            trg_vocab["stoi"], trg_vocab["itos"]
                        ),
                    }
                    for w in fixture_words
                ],
            },
            f,
            ensure_ascii=False,
            indent=2,
        )
    print(f"wrote {fixture} ({len(fixture_words)} cases)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
