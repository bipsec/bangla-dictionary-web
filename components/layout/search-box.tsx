"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBoxProps {
  variant?: "hero" | "navbar"
}

export function SearchBox({ variant = "navbar" }: SearchBoxProps) {
  const [value, setValue] = useState("")
  const router = useRouter()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      router.push(`/word-details?word=${value.trim()}`)
    }
  }

  return (
    <div
      className={cn(
        "relative",
        variant === "hero" ? "w-full max-w-2xl mx-auto" : "w-full"
      )}
    >
      <Search
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
          variant === "hero" ? "h-5 w-5" : "h-4 w-4"
        )}
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a word..."
        className={cn(
          "rounded-full",
          variant === "hero"
            ? "pl-11 pr-11 h-14 text-lg shadow-md border-2 focus-visible:border-primary"
            : "pl-9 pr-9 h-10"
        )}
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
            variant === "hero" ? "right-4" : "right-3"
          )}
        >
          <X className={variant === "hero" ? "h-5 w-5" : "h-4 w-4"} />
        </button>
      )}
    </div>
  )
}
