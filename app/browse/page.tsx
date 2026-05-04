"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { SourceBadge } from "@/components/ui/source-badge"

const vowels = "অআইঈউঊঋএঐওঔ"
const consonants = "কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ"

function LetterGrid({ letters, label }: { letters: string; label: string }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-meta uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {letters.split("").map((letter) => (
          <Link
            key={letter}
            href={`/browse/list-of-words?letter=${letter}`}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary text-lg font-semibold transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
          >
            {letter}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function BrowsePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">ব্যবহারিক বাংলা অভিধান</h1>
          <p className="text-sm text-muted-foreground font-meta">Byabaharik Bangla Abhidhan · বাংলা একাডেমি, ঢাকা</p>
          <SourceBadge source="ব্যবহারিক বাংলা অভিধান" size="md" />
        </div>
      </div>

      <div className="border-t pt-6 space-y-8">
        <LetterGrid letters={vowels} label="স্বরবর্ণ (Vowels)" />
        <LetterGrid letters={consonants} label="ব্যঞ্জনবর্ণ (Consonants)" />
      </div>
    </div>
  )
}
