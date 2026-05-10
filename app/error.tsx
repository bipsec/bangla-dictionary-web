"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">কিছু একটা ভুল হয়েছে</h2>
        <p className="text-sm text-muted-foreground font-meta">Something went wrong. Please try again.</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} variant="default">আবার চেষ্টা করুন</Button>
        <Button variant="outline" asChild>
          <Link href="/">হোমে ফিরুন</Link>
        </Button>
      </div>
    </div>
  )
}
