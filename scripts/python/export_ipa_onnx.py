"""One-off export of the Bangla→IPA transformer from PyTorch to ONNX.

The web app runs Node on Vercel and cannot load a .pth, so the trained weights are
converted once into model/ipa_model.onnx (committed) and executed at request time by
onnxruntime. Architecture and hyperparameters must match the original definition in
bang-dict-api/app/scripts/ipa_converter.py exactly, or the weights won't load.

Run with the backend's virtualenv, which already has torch:

    cd ../bang-dict-api
    .venv/Scripts/python.exe ../bangla-dictionary-web/scripts/python/export_ipa_onnx.py

Only needs re-running if the model is retrained.
"""

import argparse
import json
import pathlib
import shutil
import sys

import torch
from torch import nn

WEB_ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_API_ROOT = WEB_ROOT.parent / "bang-dict-api"

EMBEDDING_SIZE = 256
NUM_HEADS = 8
NUM_ENCODER_LAYERS = 2
NUM_DECODER_LAYERS = 2
MAX_LEN = 100
OPSET = 17

# Fixed sequence length for the exported graph.
#
# nn.MultiheadAttention reshapes with trace-time constants, so `dynamic_axes` produces a
# graph that only runs at the dummy lengths (it fails with "cannot be reshaped" otherwise).
# Exporting at one fixed length and padding at inference time avoids that entirely.
# The longest headword in the corpus is 50 characters and the longest IPA output is 34
# tokens, so 64 (including <sos>/<eos>) covers the data with room to spare.
SEQ_LEN = 64

device = torch.device("cpu")


class TranslateTransformer(nn.Module):
    """Verbatim copy of the training-time architecture."""

    def __init__(self, embedding_size, src_vocab_size, trg_vocab_size,
                 src_pad_idx, num_heads, num_encoder_layers, num_decoder_layers, max_len):
        super().__init__()
        self.srcEmbeddings = nn.Embedding(src_vocab_size, embedding_size)
        self.trgEmbeddings = nn.Embedding(trg_vocab_size, embedding_size)
        self.srcPositionalEmbeddings = nn.Embedding(max_len, embedding_size)
        self.trgPositionalEmbeddings = nn.Embedding(max_len, embedding_size)
        self.transformer = nn.Transformer(embedding_size, num_heads, num_encoder_layers, num_decoder_layers)
        self.fc_out = nn.Linear(embedding_size, trg_vocab_size)
        self.dropout = nn.Dropout(0.1)
        self.src_pad_idx = src_pad_idx
        self.max_len = max_len

    def make_src_mask(self, src):
        return (src.transpose(0, 1) == self.src_pad_idx).to(device)

    def forward(self, x, trg):
        src_seq_length, N = x.shape
        trg_seq_length = trg.shape[0]
        src_positions = (torch.arange(0, src_seq_length).reshape(src_seq_length, 1)
                         + torch.zeros(src_seq_length, N)).to(device)
        trg_positions = (torch.arange(0, trg_seq_length).reshape(trg_seq_length, 1)
                         + torch.zeros(trg_seq_length, N)).to(device)
        srcWords = self.dropout(self.srcEmbeddings(x.long()) + self.srcPositionalEmbeddings(src_positions.long()))
        trgWords = self.dropout(self.trgEmbeddings(trg.long()) + self.trgPositionalEmbeddings(trg_positions.long()))
        src_padding_mask = self.make_src_mask(x)
        trg_mask = self.transformer.generate_square_subsequent_mask(trg_seq_length).to(device)
        out = self.transformer(srcWords, trgWords, src_key_padding_mask=src_padding_mask, tgt_mask=trg_mask)
        return self.fc_out(out)


class PaddedExportWrapper(nn.Module):
    """Fixed-length wrapper around the trained model, for export and for parity checks.

    Both inputs arrive padded to SEQ_LEN. Two mask arguments make the padded call
    mathematically identical to the original variable-length call:

    * `src_key_padding_mask` — already in the original forward(); hides src pad positions
      from encoder self-attention. Added here for the *decoder's* cross-attention too
      (`memory_key_padding_mask`), which the original never needed because its memory had
      no padding.
    * `tgt_mask` — causal, so a decoder position only attends to earlier positions. Target
      padding therefore cannot influence any real position, and the caller simply reads the
      logits at the last real step.
    """

    def __init__(self, model: TranslateTransformer, src_pad_idx: int, trg_pad_idx: int):
        super().__init__()
        self.model = model
        self.src_pad_idx = src_pad_idx
        self.trg_pad_idx = trg_pad_idx

    def forward(self, src: torch.Tensor, trg: torch.Tensor) -> torch.Tensor:
        m = self.model
        src_seq_length, N = src.shape
        trg_seq_length = trg.shape[0]

        src_positions = (torch.arange(0, src_seq_length).reshape(src_seq_length, 1)
                         + torch.zeros(src_seq_length, N)).to(device)
        trg_positions = (torch.arange(0, trg_seq_length).reshape(trg_seq_length, 1)
                         + torch.zeros(trg_seq_length, N)).to(device)

        src_words = m.srcEmbeddings(src.long()) + m.srcPositionalEmbeddings(src_positions.long())
        trg_words = m.trgEmbeddings(trg.long()) + m.trgPositionalEmbeddings(trg_positions.long())

        src_padding_mask = (src.transpose(0, 1) == self.src_pad_idx)
        trg_mask = torch.triu(
            torch.full((trg_seq_length, trg_seq_length), float("-inf")), diagonal=1
        ).to(device)

        out = m.transformer(
            src_words,
            trg_words,
            src_key_padding_mask=src_padding_mask,
            memory_key_padding_mask=src_padding_mask,
            tgt_mask=trg_mask,
        )
        return m.fc_out(out)


def build_model(model_dir: pathlib.Path) -> tuple[TranslateTransformer, dict, dict]:
    with open(model_dir / "src_vocab.json", encoding="utf-8") as f:
        src_vocab = json.load(f)
    with open(model_dir / "trg_vocab.json", encoding="utf-8") as f:
        trg_vocab = json.load(f)

    model = TranslateTransformer(
        embedding_size=EMBEDDING_SIZE,
        src_vocab_size=len(src_vocab["itos"]),
        trg_vocab_size=len(trg_vocab["itos"]),
        src_pad_idx=src_vocab["stoi"]["<pad>"],
        num_heads=NUM_HEADS,
        num_encoder_layers=NUM_ENCODER_LAYERS,
        num_decoder_layers=NUM_DECODER_LAYERS,
        max_len=MAX_LEN,
    ).to(device)
    model.load_state_dict(torch.load(model_dir / "ipa_model.pth", map_location=device))
    model.eval()
    return model, src_vocab, trg_vocab


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--api-root", type=pathlib.Path, default=DEFAULT_API_ROOT,
                        help="path to the bang-dict-api checkout holding app/model")
    parser.add_argument("--out-dir", type=pathlib.Path, default=WEB_ROOT / "model")
    args = parser.parse_args()

    model_dir = args.api_root / "app" / "model"
    if not (model_dir / "ipa_model.pth").exists():
        print(f"error: {model_dir / 'ipa_model.pth'} not found", file=sys.stderr)
        return 1

    model, src_vocab, trg_vocab = build_model(model_dir)
    wrapper = PaddedExportWrapper(
        model,
        src_pad_idx=src_vocab["stoi"]["<pad>"],
        trg_pad_idx=trg_vocab["stoi"]["<pad>"],
    ).eval()
    args.out_dir.mkdir(parents=True, exist_ok=True)

    # Shapes are (SEQ_LEN, batch=1) and fixed — see the SEQ_LEN comment above.
    dummy_src = torch.full((SEQ_LEN, 1), src_vocab["stoi"]["<pad>"], dtype=torch.long)
    dummy_src[0] = src_vocab["stoi"]["<sos>"]
    dummy_trg = torch.full((SEQ_LEN, 1), trg_vocab["stoi"]["<pad>"], dtype=torch.long)
    dummy_trg[0] = trg_vocab["stoi"]["<sos>"]

    onnx_path = args.out_dir / "ipa_model.onnx"
    torch.onnx.export(
        wrapper,
        (dummy_src, dummy_trg),
        str(onnx_path),
        input_names=["src", "trg"],
        output_names=["logits"],
        opset_version=OPSET,
        do_constant_folding=True,
    )

    for name in ("src_vocab.json", "trg_vocab.json"):
        shutil.copyfile(model_dir / name, args.out_dir / name)

    # The Node runtime reads these instead of hardcoding them.
    with open(args.out_dir / "config.json", "w", encoding="utf-8") as f:
        json.dump(
            {
                "seq_len": SEQ_LEN,
                "max_decode_steps": 60,
                "src_pad_idx": src_vocab["stoi"]["<pad>"],
                "trg_pad_idx": trg_vocab["stoi"]["<pad>"],
                "opset": OPSET,
            },
            f,
            indent=2,
        )

    size_mb = onnx_path.stat().st_size / (1024 * 1024)
    print(f"wrote {onnx_path} ({size_mb:.1f} MB, fixed seq_len={SEQ_LEN})")
    print(f"copied src_vocab.json / trg_vocab.json and wrote config.json into {args.out_dir}")
    print("next: run verify_ipa_onnx.py to confirm PyTorch/ONNX parity")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
