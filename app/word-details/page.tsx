"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

function Redirector() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const word = searchParams.get("word")

  useEffect(() => {
    if (word) {
      router.replace(`/word/${encodeURIComponent(word)}`)
    } else {
      router.replace("/browse")
    }
  }, [word, router])

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

export default function WordDetailsPage() {
  return (
    <Suspense fallback={<div />}>
      <Redirector />
    </Suspense>
  )
}
