"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { SourceBadge } from "@/components/ui/source-badge"
import { fetchWordDetails, fetchWords } from "@/lib/api"
import { addWordToHistory } from "@/lib/word-history"

interface Spelling {
  meaning_no: number
  meaning: string
  pos?: string
  source?: string
}

interface WordData {
  word?: string
  ipa?: string
  similar_spellings?: Spelling[]
}

export default function WordDetailsPage() {
  return (
    <Suspense fallback={<WordDetailsSkeleton />}>
      <WordDetailsContent />
    </Suspense>
  )
}

function WordDetailsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-12 w-64 mx-auto" />
      <Skeleton className="h-px w-full" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

function WordDetailsContent() {
  const searchParams = useSearchParams()
  const word = searchParams.get("word")
  const [wordDetails, setWordDetails] = useState<WordData>({})
  const [relatedWords, setRelatedWords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (word) {
      setLoading(true)
      setError(null)
      addWordToHistory(word)
      fetchWordDetails(word)
        .then((data) => setWordDetails(data))
        .catch(() => setError("তথ্য আনতে সমস্যা হয়েছে।"))
        .finally(() => setLoading(false))

      const firstChar = word.charAt(0)
      fetchWords(firstChar, 1, 500)
        .then((data) => {
          const words: string[] = (data.words || []).map((w: { word: string }) => w.word)
          const related = words.filter((w) => w !== word).slice(0, 10)
          setRelatedWords(related)
        })
        .catch(() => setRelatedWords([]))
    }
  }, [word])

  if (loading) return <WordDetailsSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Search className="h-8 w-8" />
        </div>
        <p className="text-destructive font-medium">{error}</p>
        <Button variant="outline" asChild>
          <Link href="/browse">
            <ArrowLeft className="mr-2 h-4 w-4" /> ফিরে যান
          </Link>
        </Button>
      </div>
    )
  }

  if (!wordDetails?.word) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold">শব্দটি পাওয়া যায়নি</h2>
        <p className="text-muted-foreground">বানান যাচাই করে আবার চেষ্টা করুন।</p>
        <Button variant="outline" asChild>
          <Link href="/browse">
            <ArrowLeft className="mr-2 h-4 w-4" /> অভিধান ব্রাউজ করুন
          </Link>
        </Button>
      </div>
    )
  }

  const firstLetter = wordDetails.word.charAt(0)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Word header */}
      <Card>
        <CardContent className="pt-6 pb-5">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold">{wordDetails.word}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {wordDetails.ipa && (
                <span className="font-meta text-sm text-muted-foreground">/{wordDetails.ipa}/</span>
              )}
              <SourceBadge source="ব্যবহারিক বাংলা অভিধান" size="md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meanings */}
      {wordDetails.similar_spellings && wordDetails.similar_spellings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-muted-foreground font-meta uppercase tracking-widest text-[11px]">অর্থ ও বানানভেদ</h2>
          <div className="rounded-xl overflow-hidden border divide-y divide-border/50">
            {wordDetails.similar_spellings.map((spelling, index) => (
              <div key={index} className="flex items-start gap-3 px-4 py-3 bg-card">
                {/* POS circle */}
                <div
                  title={spelling.pos || undefined}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mt-0.5"
                >
                  <span className="font-bengali text-[13px] font-semibold text-primary leading-none">
                    {spelling.pos || String(index + 1)}
                  </span>
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <p className="font-bengali text-[16px] leading-relaxed text-foreground">
                    {spelling.meaning}
                  </p>
                  {spelling.source && (
                    <SourceBadge source={spelling.source} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Words */}
      {relatedWords.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[11px] font-meta uppercase tracking-widest text-muted-foreground">সম্পর্কিত শব্দ</h2>
          <div className="flex flex-wrap gap-2">
            {relatedWords.map((w) => (
              <Link key={w} href={`/word-details?word=${w}`}>
                <Badge
                  variant="secondary"
                  className="text-sm px-3 py-1.5 cursor-pointer transition-colors hover:bg-primary/20 hover:text-primary"
                >
                  {w}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" asChild>
          <Link href={`/browse/list-of-words?letter=${firstLetter}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            {firstLetter} দিয়ে আরও শব্দ
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/browse">
            <Search className="mr-2 h-4 w-4" />
            অন্য শব্দ খুঁজুন
          </Link>
        </Button>
      </div>
    </div>
  )
}
