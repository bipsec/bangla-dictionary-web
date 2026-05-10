"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { BookOpen, ChevronLeft, ChevronRight, X, Scroll } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { API_URL as API } from "@/lib/api"
const PAGE_LIMIT = 10

const vowels = "অআইঈউঊঋএঐওঔ"
const consonants = "কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ"

interface WordItem {
  id: number
  word: string
}

interface Entry {
  id: number
  description: string
}

interface WordDetail {
  word: string
  entries: Entry[]
}

async function fetchWords(letter: string, page: number): Promise<WordItem[]> {
  const res = await fetch(
    `${API}/pouranik-utso/words?letter=${encodeURIComponent(letter)}&page=${page}&limit=${PAGE_LIMIT}`
  )
  if (!res.ok) throw new Error("Failed to fetch words")
  return res.json()
}

async function fetchWordDetail(word: string): Promise<WordDetail> {
  const res = await fetch(
    `${API}/pouranik-utso/word?word=${encodeURIComponent(word)}`
  )
  if (!res.ok) throw new Error("Failed to fetch word detail")
  return res.json()
}

export default function PouraniKUtsoPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PouraniKUtsoContent />
    </Suspense>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-72" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-lg" />
        ))}
      </div>
      <div className="space-y-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

function PouraniKUtsoContent() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [words, setWords] = useState<WordItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [wordsLoading, setWordsLoading] = useState(false)

  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [wordDetail, setWordDetail] = useState<WordDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const loadWords = useCallback(async (letter: string, p: number) => {
    setWordsLoading(true)
    try {
      const data = await fetchWords(letter, p)
      setWords(data)
      setHasMore(data.length === PAGE_LIMIT)
    } catch {
      setWords([])
      setHasMore(false)
    } finally {
      setWordsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedLetter) loadWords(selectedLetter, page)
  }, [selectedLetter, page, loadWords])

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter)
    setPage(1)
    setWords([])
    setSelectedWord(null)
    setWordDetail(null)
  }

  const handleWordSelect = async (word: string) => {
    setSelectedWord(word)
    setDetailLoading(true)
    setDetailError(null)
    setWordDetail(null)
    try {
      const data = await fetchWordDetail(word)
      setWordDetail(data)
    } catch {
      setDetailError("শব্দের তথ্য লোড করতে ব্যর্থ হয়েছে।")
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Scroll className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">পৌরাণিক উৎস</h1>
          <p className="text-sm text-muted-foreground">
            বাংলা শব্দের পৌরাণিক ও পুরাণভিত্তিক ব্যাখ্যা
          </p>
        </div>
      </div>

      {/* Letter selector */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">স্বরবর্ণ</p>
        <div className="flex flex-wrap gap-2">
          {vowels.split("").map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterSelect(letter)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border text-base font-medium transition-all hover:scale-105 hover:shadow-md ${
                selectedLetter === letter
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
        <p className="text-sm font-medium text-muted-foreground">ব্যঞ্জনবর্ণ</p>
        <div className="flex flex-wrap gap-2">
          {consonants.split("").map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterSelect(letter)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border text-base font-medium transition-all hover:scale-105 hover:shadow-md ${
                selectedLetter === letter
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {!selectedLetter && (
        <p className="text-center text-muted-foreground py-12">
          একটি বর্ণ নির্বাচন করুন
        </p>
      )}

      {selectedLetter && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Word list */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xl font-bold shadow-sm">
                {selectedLetter}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-none">শব্দতালিকা</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {wordsLoading
                    ? "লোড হচ্ছে…"
                    : words.length > 0
                    ? `${(page - 1) * PAGE_LIMIT + 1}–${(page - 1) * PAGE_LIMIT + words.length} নং শব্দ`
                    : ""}
                </p>
              </div>
            </div>

            {wordsLoading ? (
              <div className="space-y-1">
                {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full rounded-lg" />
                ))}
              </div>
            ) : words.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">কোনো শব্দ পাওয়া যায়নি।</p>
            ) : (
              <div className="rounded-xl overflow-hidden border divide-y divide-border/50">
                {words.map((item, index) => {
                  const isActive = selectedWord === item.word
                  const itemNumber = (page - 1) * PAGE_LIMIT + index + 1
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleWordSelect(item.word)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left group transition-colors duration-100 ${
                        isActive ? "bg-primary" : "bg-card hover:bg-primary/8"
                      }`}
                    >
                      <span className={`text-xs tabular-nums w-5 text-right shrink-0 ${
                        isActive ? "text-primary-foreground/60" : "text-muted-foreground/40"
                      }`}>
                        {itemNumber}
                      </span>
                      <span className={`flex-1 text-[16px] font-semibold ${
                        isActive ? "text-primary-foreground" : "text-foreground group-hover:text-primary"
                      }`}>
                        {item.word}
                      </span>
                      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-100 ${
                        isActive
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5"
                      }`} />
                    </button>
                  )
                })}
              </div>
            )}

            {!wordsLoading && words.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="h-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex-1 text-center text-xs text-muted-foreground">পৃষ্ঠা {page}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={!hasMore} className="h-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div>
            {!selectedWord && (
              <div className="flex flex-col items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground gap-2">
                <Scroll className="h-8 w-8 opacity-40" />
                <p className="text-sm">একটি শব্দ নির্বাচন করুন</p>
              </div>
            )}

            {selectedWord && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-3xl font-bold">
                      {detailLoading ? <Skeleton className="h-9 w-36" /> : wordDetail?.word ?? selectedWord}
                    </CardTitle>
                    <button
                      onClick={() => { setSelectedWord(null); setWordDetail(null) }}
                      className="text-muted-foreground hover:text-foreground transition-colors mt-1 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {detailLoading && (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  )}

                  {detailError && (
                    <p className="text-destructive text-sm">{detailError}</p>
                  )}

                  {!detailLoading && wordDetail && wordDetail.entries.length === 0 && (
                    <p className="text-sm text-muted-foreground">কোনো তথ্য পাওয়া যায়নি।</p>
                  )}

                  {!detailLoading && wordDetail && wordDetail.entries.map((entry, i) => (
                    <div key={entry.id} className="space-y-2">
                      {i > 0 && <div className="border-t pt-4" />}
                      <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                        {entry.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
