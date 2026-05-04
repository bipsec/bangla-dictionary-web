"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SourceBadge } from "@/components/ui/source-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

const COMPLETE_DICT_API = "http://localhost:8000"
const PAGE_LIMIT = 10


const vowels = "অআইঈউঊঋএঐওঔ"
const consonants = "কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ"

interface WordItem {
  id: number
  word: string
}

interface Meaning {
  id: number
  meaning: string
  pos: string
  pos_full: string
  pronunciation: string
  ipa: string
  root_lang: string
  topic_marker: string
  example: string
  synonyms: string[]
  page: string
  source: string
}

interface WordDetail {
  word: string
  ipa: string
  female_marker: string
  antonyms: string[]
  rhyme_words: string[]
  english: string[]
  pouranic_source: string | null
  meanings: Meaning[]
}

async function fetchCompleteDictWords(letter: string, page: number): Promise<WordItem[]> {
  const encoded = encodeURIComponent(letter)
  const res = await fetch(
    `${COMPLETE_DICT_API}/complete-dictionary/words?letter=${encoded}&page=${page}&limit=${PAGE_LIMIT}`
  )
  if (!res.ok) throw new Error("Failed to fetch words")
  return res.json()
}

async function fetchCompleteDictWordDetail(word: string): Promise<WordDetail> {
  const encoded = encodeURIComponent(word)
  const res = await fetch(
    `${COMPLETE_DICT_API}/complete-dictionary/word?word=${encoded}&page=1&limit=10`
  )
  if (!res.ok) throw new Error("Failed to fetch word detail")
  return res.json()
}

export default function CompleteDictionaryPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CompleteDictionaryContent />
    </Suspense>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}

function CompleteDictionaryContent() {
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
      const data = await fetchCompleteDictWords(letter, p)
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
    if (selectedLetter) {
      loadWords(selectedLetter, page)
    }
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
      const data = await fetchCompleteDictWordDetail(word)
      setWordDetail(data)
    } catch {
      setDetailError("Failed to load word details.")
    } finally {
      setDetailLoading(false)
    }
  }

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1)
  }

  const handleNext = () => {
    if (hasMore) setPage((p) => p + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">সম্পূর্ণ অভিধান</h1>
          <p className="text-sm text-muted-foreground font-meta">
            Complete Dictionary · অর্থ, IPA ও উৎস সহ
          </p>
        </div>
      </div>

      {/* Letter selector */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">স্বরবর্ণ (Vowels)</p>
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
        <p className="text-sm font-medium text-muted-foreground">ব্যঞ্জনবর্ণ (Consonants)</p>
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
            {/* Header row */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xl font-bold shadow-sm">
                {selectedLetter}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-none">শব্দতালিকা</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {wordsLoading ? "লোড হচ্ছে…" : `${(page - 1) * PAGE_LIMIT + 1}–${(page - 1) * PAGE_LIMIT + words.length} নং শব্দ`}
                </p>
              </div>
            </div>

            {/* Word list */}
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

            {/* Pagination */}
            {!wordsLoading && words.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex-1 text-center text-xs text-muted-foreground">
                  পৃষ্ঠা {page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={!hasMore}
                  className="h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Word detail panel */}
          <div>
            {!selectedWord && (
              <div className="flex flex-col items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground gap-2">
                <BookOpen className="h-8 w-8 opacity-40" />
                <p className="text-sm">একটি শব্দ নির্বাচন করুন</p>
              </div>
            )}

            {selectedWord && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-3xl font-bold font-bengali">
                        {detailLoading ? <Skeleton className="h-9 w-32" /> : wordDetail?.word ?? selectedWord}
                      </CardTitle>
                      {!detailLoading && wordDetail?.ipa && (
                        <span className="font-meta text-sm text-muted-foreground mt-1 inline-block">
                          /{wordDetail.ipa}/
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => { setSelectedWord(null); setWordDetail(null) }}
                      className="text-muted-foreground hover:text-foreground transition-colors mt-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {detailLoading && (
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-lg" />
                      ))}
                    </div>
                  )}

                  {detailError && (
                    <p className="text-destructive text-sm font-meta">{detailError}</p>
                  )}

                  {!detailLoading && wordDetail && (
                    <>
                      {/* Female marker — terracotta pill */}
                      {wordDetail.female_marker && (
                        <div className="flex items-center gap-2">
                          <span className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">স্ত্রীলিঙ্গ</span>
                          <span className="px-3 py-0.5 rounded-full text-sm font-bengali font-medium"
                            style={{ background: "#ffdbce", color: "#793f27" }}>
                            {wordDetail.female_marker}
                          </span>
                        </div>
                      )}

                      {/* English translations */}
                      {wordDetail.english.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">English</span>
                          {wordDetail.english.map((e) => (
                            <span key={e} className="font-meta text-sm font-medium text-foreground/80 bg-muted px-2.5 py-0.5 rounded">
                              {e}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Antonyms — left-border list */}
                      {wordDetail.antonyms.length > 0 && (
                        <div className="border-l-2 border-primary/40 pl-3 space-y-1">
                          <p className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">বিপরীত শব্দ</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {wordDetail.antonyms.map((w) => (
                              <span key={w} className="font-bengali text-[15px] text-foreground">{w}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rhyme words */}
                      {wordDetail.rhyme_words.length > 0 && (
                        <div className="border-l-2 border-muted-foreground/25 pl-3 space-y-1">
                          <p className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">অন্ত্যমিল</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {wordDetail.rhyme_words.map((w) => (
                              <span key={w} className="font-bengali text-[15px] text-foreground/80">{w}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Meanings */}
                      {wordDetail.meanings.length > 0 ? (
                        <div className="space-y-4">
                          {wordDetail.meanings.map((m, i) => (
                            <div key={m.id} className="space-y-2">
                              {i > 0 && <Separator />}
                              <div className="flex items-start gap-3 pt-1">
                                {/* POS circle */}
                                <div
                                  title={m.pos_full || m.pos || undefined}
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 cursor-default mt-0.5"
                                >
                                  <span className="font-bengali text-[13px] font-semibold text-primary leading-none">
                                    {m.pos || String(i + 1)}
                                  </span>
                                </div>
                                <div className="flex-1 space-y-2">
                                  {/* Meaning text */}
                                  <p className="font-bengali text-[16px] leading-relaxed text-foreground">{m.meaning}</p>

                                  {/* Grammar chips row */}
                                  <div className="flex flex-wrap gap-1.5">
                                    {/* pos removed — shown in circle above */}
                                    {m.topic_marker && (
                                      <span className="font-meta text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                        {m.topic_marker}
                                      </span>
                                    )}
                                    {m.root_lang && (
                                      <span className="font-meta text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                        {m.root_lang}
                                      </span>
                                    )}
                                    {m.pronunciation && (
                                      <span className="font-bengali text-[12px] px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">
                                        {m.pronunciation}
                                      </span>
                                    )}
                                    {m.ipa && m.ipa !== wordDetail.ipa && (
                                      <span className="font-meta text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground italic">
                                        /{m.ipa}/
                                      </span>
                                    )}
                                  </div>

                                  {/* Synonyms — inline comma list with left border */}
                                  {m.synonyms.length > 0 && (
                                    <div className="border-l-2 pl-2.5 py-0.5" style={{ borderColor: "#ffad8f" }}>
                                      <span className="font-bengali text-[11px] font-medium mr-1.5" style={{ color: "#793f27" }}>প্রতিশব্দ</span>
                                      <span className="font-bengali text-[14px] text-foreground/80">
                                        {m.synonyms.join(" · ")}
                                      </span>
                                    </div>
                                  )}

                                  {/* Example sentence */}
                                  {m.example && (
                                    <div className="bg-muted/50 rounded px-3 py-2">
                                      <p className="font-bengali text-sm text-muted-foreground italic">
                                        &ldquo;{m.example}&rdquo;
                                      </p>
                                    </div>
                                  )}

                                  {/* Source / page */}
                                  {m.source && (
                                    <div className="flex items-center gap-1.5">
                                      <SourceBadge source={m.source} />
                                      {m.page && (
                                        <span className="font-meta text-[11px] text-muted-foreground/60">
                                          পৃ. {m.page}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="font-meta text-sm text-muted-foreground">কোনো অর্থ পাওয়া যায়নি।</p>
                      )}

                      {/* Pouranic source */}
                      {wordDetail.pouranic_source && (
                        <div className="rounded-lg border-l-4 border-primary/30 bg-primary/5 px-4 py-3 space-y-1">
                          <p className="font-meta text-[11px] uppercase tracking-widest text-primary/60">পৌরাণিক উৎস</p>
                          <p className="font-bengali text-sm leading-relaxed text-foreground/80">{wordDetail.pouranic_source}</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
