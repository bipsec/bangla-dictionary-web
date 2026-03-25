"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Volume2, Search, ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
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
        .catch(() => setError("An error occurred while fetching data."))
        .finally(() => setLoading(false))

      // Fetch related words (same first letter)
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
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse
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
        <h2 className="text-xl font-semibold">Word not found</h2>
        <p className="text-muted-foreground">
          Please check the spelling and try again.
        </p>
        <Button variant="outline" asChild>
          <Link href="/browse">
            <ArrowLeft className="mr-2 h-4 w-4" /> Browse Dictionary
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
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 pt-6">
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold">{wordDetails.word}</h1>
            {wordDetails.ipa && (
              <Badge variant="secondary" className="mt-2 text-base font-normal">
                /{wordDetails.ipa}/
              </Badge>
            )}
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Volume2 className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Meanings */}
      {wordDetails.similar_spellings && wordDetails.similar_spellings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Meanings & Spellings</h2>
          {wordDetails.similar_spellings.map((spelling, index) => (
            <Card key={index}>
              <CardContent className="flex items-start gap-4 pt-4 pb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {spelling.meaning_no}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{spelling.meaning}</p>
                  <div className="flex flex-wrap gap-2">
                    {spelling.pos && (
                      <Badge variant="outline">{spelling.pos}</Badge>
                    )}
                    {spelling.source && (
                      <Badge variant="secondary">{spelling.source}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Related Words */}
      {relatedWords.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Related Words</h2>
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
            More {firstLetter} words
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/browse">
            <Search className="mr-2 h-4 w-4" />
            Search another word
          </Link>
        </Button>
      </div>
    </div>
  )
}
