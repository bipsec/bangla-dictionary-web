"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"

const vowels = "অআইঈউঊঋএঐওঔ"
const consonants = "কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ"

function LetterGrid({ letters, label }: { letters: string; label: string }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {letters.split("").map((letter) => (
          <Link
            key={letter}
            href={`/browse/list-of-words?letter=${letter}`}
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary text-lg font-medium transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
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
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Browse Dictionary</h1>
          <p className="text-sm text-muted-foreground">
            Select a letter to explore words
          </p>
        </div>
      </div>

      <LetterGrid letters={vowels} label="স্বরবর্ণ (Vowels)" />
      <LetterGrid letters={consonants} label="ব্যঞ্জনবর্ণ (Consonants)" />
    </div>
  )
}
