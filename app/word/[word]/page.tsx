"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { BookOpen, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { SourceBadge } from "@/components/ui/source-badge"
import { fetchWordDetails, fetchWords } from "@/lib/api"
import { addWordToHistory } from "@/lib/word-history"

interface Meaning {
  id: number
  definitions: string[]
  meaning: string
  pos: string
  pos_full: string
  pronunciation: string
  ipa: string
  root_lang: string
  topic_marker: string
  example: string
  synonyms: string[]
  page: string | number
  source: string
}

interface WordDetail {
  word: string
  ipa: string
  female_marker: string | null
  antonyms: string[]
  rhyme_words: string[]
  english: string[]
  pouranic_source: string | null
  meanings: Meaning[]
}

function WordSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-14 w-64" />
      <Skeleton className="h-4 w-32" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

function WordContent() {
  const params = useParams()
  const word = decodeURIComponent(params.word as string)

  const [detail, setDetail] = useState<WordDetail | null | undefined>(undefined)
  const [similar, setSimilar] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!word) return
    addWordToHistory(word)
    setLoading(true)
    setError(false)

    fetchWordDetails(word)
      .then((data) => {
        if (!data) { setDetail(null); return }
        setDetail({
          word: data.word,
          ipa: data.ipa ?? "",
          female_marker: null,
          antonyms: [],
          rhyme_words: [],
          english: [],
          pouranic_source: null,
          meanings: (data.meanings ?? []).map((m: { id: number; meaning: string; pos?: string; spelling?: string; language?: string; sentence?: string; source?: string }) => ({
            id: m.id,
            definitions: [m.meaning],
            meaning: m.meaning,
            pos: m.pos ?? "",
            pos_full: "",
            pronunciation: m.spelling ?? "",
            ipa: "",
            root_lang: m.language ?? "",
            topic_marker: "",
            example: m.sentence ?? "",
            synonyms: [],
            page: "",
            source: m.source ?? "",
          })),
        } as WordDetail)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))

    fetchWords(word.charAt(0), 1, 500)
      .then((data: { word: string }[]) => {
        const words = Array.isArray(data) ? data.map((w) => w.word) : []
        const prefix2 = word.slice(0, 2)
        const close = words.filter((w) => w !== word && w.startsWith(prefix2))
        const rest = words.filter((w) => w !== word && !w.startsWith(prefix2))
        setSimilar([...close, ...rest].slice(0, 10))
      })
      .catch(() => setSimilar([]))
  }, [word])

  if (loading) return <WordSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center max-w-3xl mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Search className="h-8 w-8" />
        </div>
        <p className="text-destructive font-medium">তথ্য আনতে সমস্যা হয়েছে।</p>
        <Button variant="outline" asChild>
          <Link href="/browse"><ArrowLeft className="mr-2 h-4 w-4" /> ফিরে যান</Link>
        </Button>
      </div>
    )
  }

  if (detail === null) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">&ldquo;{word}&rdquo;</h1>
          <h2 className="text-lg text-muted-foreground">শব্দটি অভিধানে পাওয়া যায়নি</h2>
          <p className="text-sm text-muted-foreground">বানান যাচাই করে আবার চেষ্টা করুন।</p>
          <Button variant="outline" asChild>
            <Link href="/browse"><ArrowLeft className="mr-2 h-4 w-4" /> অভিধান ব্রাউজ করুন</Link>
          </Button>
        </div>
        {similar.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-[11px] font-meta uppercase tracking-widest text-muted-foreground">এই ধরনের শব্দ</h2>
            <div className="flex flex-wrap gap-2">
              {similar.map((w) => (
                <Link key={w} href={`/word/${encodeURIComponent(w)}`}>
                  <Badge variant="secondary" className="text-sm px-3 py-1.5 cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">{w}</Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!detail) return null

  const firstLetter = detail.word.charAt(0)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <Card>
        <CardContent className="pt-6 pb-5">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold">{detail.word}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {detail.ipa && (
                <span className="font-meta text-sm text-muted-foreground">/{detail.ipa}/</span>
              )}
              {detail.meanings[0]?.source && (
                <SourceBadge source={detail.meanings[0].source} size="md" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extras */}
      {detail.female_marker && (
        <div className="flex items-center gap-2">
          <span className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">স্ত্রীলিঙ্গ</span>
          <span className="px-3 py-0.5 rounded-full text-sm font-bengali font-medium" style={{ background: "#ffdbce", color: "#793f27" }}>
            {detail.female_marker}
          </span>
        </div>
      )}
      {detail.english.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">English</span>
          {detail.english.map((e) => (
            <span key={e} className="font-meta text-sm font-medium text-foreground/80 bg-muted px-2.5 py-0.5 rounded">{e}</span>
          ))}
        </div>
      )}
      {detail.antonyms.length > 0 && (
        <div className="border-l-2 border-primary/40 pl-3 space-y-1">
          <p className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">বিপরীত শব্দ</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {detail.antonyms.map((w) => (
              <span key={w} className="font-bengali text-[15px] text-foreground">{w}</span>
            ))}
          </div>
        </div>
      )}
      {detail.rhyme_words.length > 0 && (
        <div className="border-l-2 border-muted-foreground/25 pl-3 space-y-1">
          <p className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">অন্ত্যমিল</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {detail.rhyme_words.map((w) => (
              <span key={w} className="font-bengali text-[15px] text-foreground/80">{w}</span>
            ))}
          </div>
        </div>
      )}

      {/* Meanings */}
      {detail.meanings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[11px] font-meta uppercase tracking-widest text-muted-foreground">অর্থ</h2>
          <div className="rounded-xl overflow-hidden border divide-y divide-border/50">
            {detail.meanings.map((m, index) => (
              <div key={m.id} className="flex items-start gap-3 px-4 py-3 bg-card">
                <div
                  title={m.pos_full || m.pos || undefined}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mt-0.5 cursor-default"
                >
                  <span className="font-bengali text-[13px] font-semibold text-primary leading-none">
                    {m.pos || String(index + 1)}
                  </span>
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  {(m.definitions?.length ?? 0) > 1 ? (
                    <ol className="list-decimal list-inside space-y-0.5">
                      {m.definitions.map((d, di) => (
                        <li key={di} className="font-bengali text-[16px] leading-relaxed text-foreground">{d}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="font-bengali text-[16px] leading-relaxed text-foreground">{m.definitions?.[0] ?? m.meaning}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {m.topic_marker && (
                      <span className="font-meta text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">{m.topic_marker}</span>
                    )}
                    {m.root_lang && (
                      <span className="font-meta text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">{m.root_lang}</span>
                    )}
                  </div>
                  {m.synonyms?.length > 0 && (
                    <div className="border-l-2 pl-2.5 py-0.5" style={{ borderColor: "#ffad8f" }}>
                      <span className="font-bengali text-[11px] font-medium mr-1.5" style={{ color: "#793f27" }}>প্রতিশব্দ</span>
                      <span className="font-bengali text-[14px] text-foreground/80">{m.synonyms.join(" · ")}</span>
                    </div>
                  )}
                  {m.example && (
                    <div className="bg-muted/50 rounded px-3 py-2">
                      <p className="font-bengali text-sm text-muted-foreground italic">&ldquo;{m.example}&rdquo;</p>
                    </div>
                  )}
                  {m.source && (
                    <div className="flex items-center gap-1.5">
                      <SourceBadge source={m.source} />
                      {m.page && (
                        <span className="font-meta text-[11px] text-muted-foreground/40" title="পৃষ্ঠা নম্বর নির্ভুল নাও হতে পারে">
                          পৃ. {m.page}*
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pouranic source */}
      {detail.pouranic_source && (
        <div className="rounded-lg border-l-4 border-primary/30 bg-primary/5 px-4 py-3 space-y-1">
          <p className="font-meta text-[11px] uppercase tracking-widest text-primary/60">পৌরাণিক উৎস</p>
          <p className="font-bengali text-sm leading-relaxed text-foreground/80">{detail.pouranic_source}</p>
        </div>
      )}

      {/* Similar words */}
      {similar.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[11px] font-meta uppercase tracking-widest text-muted-foreground">সম্পর্কিত শব্দ</h2>
          <div className="flex flex-wrap gap-2">
            {similar.map((w) => (
              <Link key={w} href={`/word/${encodeURIComponent(w)}`}>
                <Badge variant="secondary" className="text-sm px-3 py-1.5 cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">{w}</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" asChild>
          <Link href={`/browse/list-of-words?letter=${firstLetter}`}>
            <BookOpen className="mr-2 h-4 w-4" />{firstLetter} দিয়ে আরও শব্দ
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/browse">
            <Search className="mr-2 h-4 w-4" />অন্য শব্দ খুঁজুন
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function WordPage() {
  return <WordContent />
}
