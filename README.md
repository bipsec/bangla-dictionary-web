# Bangla Dictionary Web

A comprehensive online Bangla dictionary built with Next.js, shadcn/ui, and Tailwind CSS. Search words, explore meanings, generate IPA pronunciation, and more.

## Features

### Dictionary & Search
- **Word Search** — Look up any Bangla word with detailed meanings, parts of speech, and source references
- **Search Autocomplete** — Get real-time word suggestions as you type, powered by the dictionary API
- **Keyboard Shortcut** — Press `Ctrl+K` (or `Cmd+K` on Mac) to instantly focus the search bar from anywhere
- **Browse by Letter** — Explore the full dictionary organized by Bengali alphabet, grouped into vowels (স্বরবর্ণ) and consonants (ব্যঞ্জনবর্ণ)

### Word Details
- **Meanings & Definitions** — View numbered definitions with part of speech and dictionary source
- **IPA Pronunciation** — See the International Phonetic Alphabet notation for each word
- **Related Words** — Discover other words starting with the same letter on every word detail page
- **Word History** — Recently searched words are saved locally and shown on the home page for quick access

### IPA Translator
- **Bangla Input** — Type Bangla text directly and generate its IPA pronunciation via the API

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

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm
- Backend API server running (default: `http://localhost:8000`)

## Setup

```sh
git clone https://github.com/bipsec/bangla-dictionary-web.git
cd bangla-dictionary-web
cp .env.example .env.local   # Edit if your API runs on a different host/port
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API base URL |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Theme**: next-themes (dark/light mode)
- **Icons**: lucide-react
- **Language**: TypeScript

## Project Structure

```
app/
  page.tsx              # Home — hero search, quick links, history, references
  browse/
    page.tsx            # Letter grid (vowels & consonants)
    list-of-words/
      page.tsx          # Words list for a selected letter
  word-details/
    page.tsx            # Word detail — meanings, IPA, related words
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
  api.ts                # API client (fetchWords, fetchWordDetails, fetchIPA)
  word-history.ts       # localStorage word history utility
  avro/                 # Avro Phonetic conversion library
  utils.ts              # Tailwind class merge utility
```

## License

MIT
