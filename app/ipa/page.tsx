"use client"

import { Languages } from "lucide-react"
import { BanglaInput } from "@/components/ipa/bangla-input"

export default function IpaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Languages className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">IPA Translator</h1>
          <p className="text-sm text-muted-foreground">
            Convert Bangla text to International Phonetic Alphabet
          </p>
        </div>
      </div>

      <BanglaInput />
    </div>
  )
}
