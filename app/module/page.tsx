"use client"

import { useState } from "react"
import { Package, Copy, Check, Terminal, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const codeExamples = [
  {
    title: "Get meaning",
    code: `bd.get_meaning("অই")`,
  },
  {
    title: "Get pronunciation",
    code: `bd.get_pronunciation("অংগুষ্ঠানা")`,
  },
  {
    title: "Get example sentence",
    code: `bd.get_example("অকাজ")`,
  },
  {
    title: "Get part of speech",
    code: `bd.get_pos("অকাট্য")`,
  },
  {
    title: "Get word type",
    code: `bd.get_type("অঋণ")`,
  },
  {
    title: "Get source",
    code: `bd.get_source("অকাণ্ড")`,
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

export default function PypiPackagePage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">PyPI Package</h1>
          <p className="text-sm text-muted-foreground font-meta">bangla-dictionary · Python · MIT License</p>
        </div>
        <div className="ml-auto flex gap-1.5">
          <Badge>bangla-dictionary</Badge>
          <Badge variant="secondary">MIT</Badge>
        </div>
      </div>

      {/* Install + Quick start side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border bg-muted/40 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-meta text-muted-foreground uppercase tracking-widest">
            <Terminal className="h-3.5 w-3.5" />
            Installation
          </div>
          <div className="flex items-center justify-between gap-2 bg-background rounded-md px-3 py-2 border">
            <code className="font-mono text-sm">pip install bangla-dictionary</code>
            <CopyButton text="pip install bangla-dictionary" />
          </div>
        </div>

        <div className="rounded-lg border bg-muted/40 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-meta text-muted-foreground uppercase tracking-widest">
            Quick Start
          </div>
          <div className="flex items-start justify-between gap-2 bg-background rounded-md px-3 py-2 border overflow-hidden">
            <pre className="font-mono text-xs leading-relaxed overflow-x-auto flex-1">{`from bangla_dictionary.dictionary import BanglaDictionary\nbd = BanglaDictionary()`}</pre>
            <CopyButton text={`from bangla_dictionary.dictionary import BanglaDictionary\nbd = BanglaDictionary()`} />
          </div>
        </div>
      </div>

      {/* Usage examples — compact 2-col grid */}
      <div className="space-y-2">
        <p className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">Usage Examples</p>
        <div className="rounded-xl border overflow-hidden divide-y divide-border/50">
          {codeExamples.map((ex, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-card hover:bg-muted/30 transition-colors">
              <span className="font-meta text-[11px] text-muted-foreground w-36 shrink-0">{ex.title}</span>
              <code className="font-mono text-sm flex-1 text-foreground">{ex.code}</code>
              <CopyButton text={ex.code} />
            </div>
          ))}
        </div>
      </div>

      {/* License note */}
      <p className="font-meta text-[11px] text-muted-foreground/60 text-center">
        Released under the MIT License · Free to use, modify, and distribute
      </p>

    </div>
  )
}
