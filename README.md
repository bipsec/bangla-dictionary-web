# Bangla Dictionary Web

A comprehensive online Bangla dictionary built with Next.js, shadcn/ui, and Tailwind CSS. Search words, explore meanings, generate IPA pronunciation, and more.

This is a **self-contained application**: the UI, the API, and the Bangla→IPA model all live in
this repo and deploy together to Vercel. There is no separate backend service to run.

## Features

### Dictionary & Search
- **Word Search** — Look up any Bangla word with detailed meanings, parts of speech, and source references
- **Search Autocomplete** — Get real-time word suggestions as you type
- **Keyboard Shortcut** — Press `Ctrl+K` (or `Cmd+K` on Mac) to instantly focus the search bar from anywhere
- **Browse by Letter** — Explore the full dictionary organized by Bengali alphabet, grouped into vowels (স্বরবর্ণ) and consonants (ব্যঞ্জনবর্ণ)

### Word Details
- **Meanings & Definitions** — View numbered definitions with part of speech and dictionary source
- **IPA Pronunciation** — See the International Phonetic Alphabet notation for each word
- **Related Words** — Discover other words starting with the same letter on every word detail page
- **Word History** — Recently searched words are saved locally and shown on the home page for quick access

### IPA Translator
- **Bangla Input** — Type Bangla text and generate its IPA pronunciation. Known words come from
  the database; anything else is transcribed by a transformer model running in the API route.

### PyPI Package
- **bangla-dictionary** — Documentation and usage examples for the [bangla-dictionary](https://pypi.org/project/bangla-dictionary/) Python package, which provides programmatic access to meanings, pronunciations, examples, parts of speech, types, and sources

### UI & Navigation
- **Top Navigation** — Desktop horizontal nav bar with embedded search
- **Bottom Tab Bar** — Fixed bottom tabs on mobile for easy navigation
- **Breadcrumbs** — Auto-generated breadcrumb trail (Browse > Letter > Word)
- **Mobile Search Overlay** — Full-screen search on mobile with auto-focus
- **Dark / Light Mode** — Toggle between themes; all components respect the active theme
- **Responsive Design** — Optimized layout for desktop, tablet, and mobile

### References
- ব্যবহারিক বাংলা অভিধান — Bangla Academy, Dhaka
- বাংলা একাডেমি আধুনিক বাংলা অভিধান — Bangla Academy, Dhaka
- সংসদ বাংলা অভিধান — Sailendra Biswas, Sahitya Samsad, Kolkata

## Architecture

```
Browser ──▶ Next.js page (client component)
                │
                └─▶ lib/api.ts ──▶ /api/* route handler ──▶ Postgres
                                            │
                                            └─▶ model/ipa_model.onnx  (IPA misses only)
```

| Route | Backing table(s) |
|-------|------------------|
| `GET /api/dictionary/words?letter&page&limit` | `word_meaning` |
| `GET /api/dictionary/word?word&page&limit` | `word_meaning` |
| `GET /api/complete-dictionary/words?letter&page&limit` | `enriched_dictionary` |
| `GET /api/complete-dictionary/word?word&page&limit` | `enriched_dictionary` |
| `GET /api/pouranik-utso/words?letter&page&limit` | `pouranik_utso` |
| `GET /api/pouranik-utso/word?word` | `pouranik_utso` |
| `GET /api/ipa?word` | `ipa`, `enriched_dictionary`, then the ONNX model |
| `GET /api/health` | `SELECT 1` |

Dictionary reads are served with `Cache-Control: s-maxage=86400, stale-while-revalidate=604800`;
the data is immutable, so Vercel's CDN absorbs nearly all traffic. `/api/ipa` is uncached and
writes each inferred transcription back into the `ipa` table, so a word is only ever inferred once.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer
- npm
- A Postgres database ([Neon](https://neon.tech) recommended — see below)
- Python 3.10+ **only** if you need to re-export the IPA model (the exported model is committed)

## Setup

```sh
git clone https://github.com/bipsec/bangla-dictionary-web.git
cd bangla-dictionary-web
cp .env.example .env.local   # set DATABASE_URL
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

If your database is empty, load it first — see [Loading the data](#loading-the-data).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | yes | Postgres connection string. Use Neon's **pooled** string in production. |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical origin, used by `app/sitemap.ts` and `app/robots.ts`. |

`lib/server/db.ts` picks its driver from the URL: `*.neon.tech` hosts go over Neon's HTTP driver
(no TCP pool to exhaust when Vercel scales out), anything else falls back to node-postgres, so a
local Postgres works for development.

Because the Neon driver tunnels SQL over HTTPS and Next.js patches global `fetch`, that driver is
constructed with `fetchOptions: { cache: "no-store" }`. Without it, Next.js treats each query as a
cacheable request and replays stale results for any repeat of the same SQL and parameters — an
on-disk cache that outlives both the process and the deploy. Nothing about this reproduces on a
local `pg` connection, where queries go over a TCP socket that `fetch` never sees.

## Loading the data

The source files are large (39 MB – 210 MB) and live in `/data`, which is gitignored. Copy them in
before loading:

| File | Loads into |
|------|-----------|
| `data/bangla_dictionary_updated.csv` | `word_meaning` |
| `data/generated_word_ipa.csv` | `ipa` |
| `data/enriched_all.json` | `enriched_dictionary` |
| `data/pouranik_uthsho_parsed.json` | `pouranik_utso` |

```sh
npm run db:migrate     # create tables + indexes (idempotent)
npm run db:load:all    # ~350 MB loaded; enriched_all.json takes the longest
npm run db:stats       # row counts and database size
```

The loaders stream their input and bulk-insert with `COPY`, so they do not need the file to fit in
memory. Load `word_meaning` before `ipa` — the IPA rows reference `word_meaning` ids by position.

Watch the total: a loaded database is around **350 MB**, and Neon's free tier caps at 512 MB.
`npm run db:stats` prints the current size against that ceiling.

## The IPA model

`model/` holds an ONNX export of the PyTorch transformer, committed so deploys need no Python:

| File | Purpose |
|------|---------|
| `ipa_model.onnx` | The model (~23 MB) |
| `src_vocab.json` / `trg_vocab.json` | Character and IPA-token vocabularies |
| `config.json` | Sequence length, decode cap, padding indices |
| `parity-fixture.json` | Reference transcriptions from the original PyTorch model |

It runs through `onnxruntime-web`'s WASM backend (no native binary), single-threaded, with the
session cached at module scope so warm invocations skip the 23 MB read. Expect roughly 150 ms per
word once warm.

The exported graph has a **fixed** sequence length of 64: `nn.MultiheadAttention` bakes trace-time
shapes into its reshapes, so a dynamic-axis export produces a graph that only runs at the dummy
lengths. Inputs are padded to 64 at inference time, with the padding masked out of the encoder, the
decoder's memory, and the causal target mask — which makes the padded graph mathematically
equivalent to the variable-length original.

To re-export after retraining (needs `torch`, `onnx`, `onnxruntime`):

```sh
python scripts/python/export_ipa_onnx.py     # writes model/
python scripts/python/verify_ipa_onnx.py     # PyTorch vs ONNX, requires 100% exact match
node scripts/verify-ipa-node.mjs             # this repo's TS decode loop vs the fixture
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Apply `sql/schema.sql` |
| `npm run db:load:all` | Run all four loaders in the required order |
| `npm run db:load:dictionary` / `:ipa` / `:complete` / `:pouranik` | Run one loader |
| `npm run db:stats` | Row counts and database size |
| `npm run smoke` | Exercise every API route (see below) |
| `npm run verify:deploy` | Prove the IPA model works from the deployed file set (run after `build`) |

## Deploying to Vercel

1. Import the repo. Framework preset **Next.js**; the defaults are correct.
2. Set `DATABASE_URL` (Neon pooled string) and `NEXT_PUBLIC_SITE_URL` for Production, Preview, and
   Development.
3. Deploy, then check `/api/health` returns `{"status":"ok","database":"ok"}`.
4. Hit `/ipa` with a word that is *not* in the database to confirm the model loads inside the
   function's time limit. The first such request pays a cold start.

`vercel.json` gives `/api/ipa` `maxDuration: 60` and 1 GB of memory; the other routes use defaults.

### Why the IPA route needs explicit file tracing

Vercel ships only the files its bundler traced, and the model route depends on three things that
tracing cannot see, each configured in `next.config.js`:

- `serverComponentsExternalPackages` keeps `onnxruntime-web` out of the bundle — its ESM entry
  cannot be processed by webpack/Terser, and its `.wasm` files must stay real files on disk.
- `outputFileTracingIncludes` ships `./model/**`, read at runtime through `fs` rather than imported.
- The same setting ships `ort-wasm-simd-threaded.wasm` **and** the `.mjs` glue beside it, which
  onnxruntime loads by dynamic path.

Get any of these wrong and the build still succeeds and the route still deploys — it just throws
`no available backend found` on the first word that misses the database cache. `npm run verify:deploy`
copies the traced file set to a scratch directory and runs a real inference there, so this failure
gets caught locally instead of in production:

```sh
npm run build && npm run verify:deploy
```

## Verification

`scripts/smoke.mjs` exercises all eight routes. Given a reference API it deep-compares every
response, which is how the port from the previous Python service was validated:

```sh
npm start &                                   # or: npm run dev
TARGET_URL=http://127.0.0.1:3000 npm run smoke
```

Run without `REFERENCE_URL` it checks each route responds sensibly. With `REFERENCE_URL` pointing at
a compatible API it asserts byte-equality, plus four intentional differences from the old service:

- out-of-range `page`/`limit` are **clamped** rather than rejected with 422
- multi-word IPA input is transcribed **per word** instead of as one oversized token
- `DISTINCT`/`DISTINCT ON` queries gained an `ORDER BY` tiebreaker, so pagination is deterministic
  (previously a row's `id` among duplicates was whatever Postgres returned)
- a malformed JSON column yields `[]` instead of a 500

The IPA cases also assert that a freshly inferred word comes back as `source: "db"` on the next
request. That is the only check that catches a broken write-back cache — query caching or a
non-awaited insert both leave `source: "model"` correct while the model silently re-runs forever.

## Tech Stack

- **Framework**: Next.js 14 (App Router, Route Handlers)
- **Database**: Postgres via `@neondatabase/serverless` (HTTP) or `pg` (TCP)
- **Inference**: onnxruntime-web (WASM)
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Theme**: next-themes (dark/light mode)
- **Icons**: lucide-react
- **Language**: TypeScript

## Project Structure

```
app/
  page.tsx              # Home — hero search, quick links, history, references
  api/                  # Route handlers — the entire backend
    dictionary/         #   word_meaning: words list + word detail
    complete-dictionary/#   enriched_dictionary: words list + word detail
    pouranik-utso/      #   pouranik_utso: words list + word detail
    ipa/                #   DB lookup, then ONNX inference + write-back cache
    health/             #   readiness probe
  browse/
    page.tsx            # Letter grid (vowels & consonants)
    list-of-words/
      page.tsx          # Words list for a selected letter
  word/[word]/
    page.tsx            # Word detail — meanings, IPA, related words
  complete-dictionary/
    page.tsx            # Enriched dictionary browser
  pouranik-utso/
    page.tsx            # Pouranik source browser
  ipa/
    page.tsx            # IPA translator
  module/
    page.tsx            # PyPI package documentation
  instructions/
    page.tsx            # Help & FAQ
components/
  layout/
    top-nav.tsx         # Desktop navigation bar
    bottom-tab-bar.tsx  # Mobile bottom tabs
    breadcrumb-nav.tsx  # Auto-generated breadcrumbs
    search-box.tsx      # Search with autocomplete & history
    search-overlay.tsx  # Mobile full-screen search
    footer.tsx          # Site footer
  ipa/
    bangla-input.tsx    # Bangla text input for IPA generation
  ui/                   # shadcn/ui components
lib/
  api.ts                # Client for this app's own /api routes
  server/               # Server-only: db, query params, responses, rate limit, inference
  word-history.ts       # localStorage word history utility
  avro/                 # Avro Phonetic conversion library
  utils.ts              # Tailwind class merge utility
model/                  # Committed ONNX model + vocabularies
scripts/                # Local CLI: migrate, loaders, stats, smoke, ONNX export
sql/schema.sql          # Table and index definitions
```

## License

MIT
