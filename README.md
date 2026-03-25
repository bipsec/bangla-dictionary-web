## Bangla Dictionary Web

A comprehensive online Bangla dictionary built with Next.js, shadcn/ui, and Tailwind CSS.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

### Setup

```sh
git clone https://github.com/bipsec/bangla-dictionary-web.git
cd bangla-dictionary-web
cp .env.example .env.local   # Edit if your API runs on a different host/port
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Theme**: next-themes (dark/light mode)
- **Language**: TypeScript
