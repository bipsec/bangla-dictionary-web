"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { fetchWords } from "@/lib/api"

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
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
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
      fetchWords(letter)
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
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
          {letter}
        </div>
        <div>
          <h1 className="text-2xl font-bold">Words starting with {letter}</h1>
          <Badge variant="secondary">{words.length} words</Badge>
        </div>
      </div>

      {words.length === 0 ? (
        <p className="text-lg text-muted-foreground py-8 text-center">
          No words found for this letter.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {paginatedData.map((item, index) => (
              <Link
                key={index}
                href={`/word-details?word=${item?.word}`}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-foreground hover:bg-accent transition-colors"
              >
                <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{item?.word}</span>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, words.length)} of {words.length} words
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
