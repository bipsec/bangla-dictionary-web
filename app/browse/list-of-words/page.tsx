"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { fetchCompleteWords } from "@/lib/api"

const ITEMS_PER_PAGE = 25

export default function WordListPage() {
  return (
    <Suspense fallback={<WordListSkeleton />}>
      <WordListContent />
    </Suspense>
  )
}

function WordListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="rounded-xl overflow-hidden border divide-y">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-none" />
        ))}
      </div>
    </div>
  )
}

function WordListContent() {
  const searchParams = useSearchParams()
  const letter = searchParams.get("letter")
  const [words, setWords] = useState<{ word: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (letter) {
      setLoading(true)
      fetchCompleteWords(letter)
        .then((data) => setWords(data))
        .catch(() => setWords([]))
        .finally(() => setLoading(false))
    }
  }, [letter])

  const totalPages = Math.ceil(words.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = words.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (loading) return <WordListSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground text-3xl font-bold shadow-sm">
          {letter}
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold">{letter} দিয়ে শুরু শব্দসমূহ</h1>
          <div className="flex items-center gap-2">
            <span className="font-meta text-xs text-muted-foreground">{words.length}টি শব্দ · সম্পূর্ণ অভিধান</span>
          </div>
        </div>
      </div>

      {words.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">কোনো শব্দ পাওয়া যায়নি।</p>
      ) : (
        <>
          <div className="rounded-xl overflow-hidden border divide-y divide-border/50">
            {paginatedData.map((item, index) => (
              <Link
                key={index}
                href={`/word/${encodeURIComponent(item?.word ?? "")}`}
                className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-primary/8 group transition-colors"
              >
                <span className="font-meta text-xs tabular-nums w-5 text-right shrink-0 text-muted-foreground/40">
                  {startIndex + index + 1}
                </span>
                <span className="flex-1 text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item?.word}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="space-y-2">
              <p className="font-meta text-xs text-muted-foreground text-center">
                {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, words.length)} / {words.length}টি শব্দ
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) page = i + 1
                    else if (currentPage <= 3) page = i + 1
                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i
                    else page = currentPage - 2 + i
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}
