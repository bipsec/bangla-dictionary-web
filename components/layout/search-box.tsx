"use client"

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Clock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { fetchWords } from "@/lib/api"
import { getWordHistory, addWordToHistory } from "@/lib/word-history"

interface SearchBoxProps {
  variant?: "hero" | "navbar"
}

export interface SearchBoxHandle {
  focus: () => void
}

export const SearchBox = forwardRef<SearchBoxHandle, SearchBoxProps>(
  function SearchBox({ variant = "navbar" }, ref) {
    const [value, setValue] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [history, setHistory] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus()
      },
    }))

    // Load history on mount
    useEffect(() => {
      setHistory(getWordHistory())
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClick)
      return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    const fetchSuggestions = useCallback(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([])
        return
      }
      try {
        const firstLetter = query.trim().charAt(0)
        const data = await fetchWords(firstLetter, 1, 500)
        const words: string[] = (data.words || []).map((w: { word: string }) => w.word)
        const filtered = words
          .filter((w: string) => w.startsWith(query.trim()))
          .slice(0, 8)
        setSuggestions(filtered)
      } catch {
        setSuggestions([])
      }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value
      setValue(text)
      setActiveIndex(-1)
      setOpen(true)

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => fetchSuggestions(text), 300)
    }

    const navigateToWord = (word: string) => {
      const trimmed = word.trim()
      if (!trimmed) return
      addWordToHistory(trimmed)
      setHistory(getWordHistory())
      setValue("")
      setSuggestions([])
      setOpen(false)
      router.push(`/word-details?word=${trimmed}`)
    }

    const displayList = value.trim()
      ? suggestions
      : history.slice(0, 6)

    const isHistoryMode = !value.trim() && displayList.length > 0

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < displayList.length) {
          navigateToWord(displayList[activeIndex])
        } else if (value.trim()) {
          navigateToWord(value)
        }
        return
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setOpen(true)
        setActiveIndex((prev) => (prev < displayList.length - 1 ? prev + 1 : 0))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayList.length - 1))
        return
      }
      if (e.key === "Escape") {
        setOpen(false)
        setActiveIndex(-1)
      }
    }

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative",
          variant === "hero" ? "w-full max-w-2xl mx-auto" : "w-full"
        )}
      >
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10",
            variant === "hero" ? "h-5 w-5" : "h-4 w-4"
          )}
        />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder="Search for a word..."
          className={cn(
            "rounded-full",
            variant === "hero"
              ? "pl-11 pr-11 h-14 text-lg shadow-md border-2 focus-visible:border-primary"
              : "pl-9 pr-9 h-10"
          )}
        />
        {variant === "navbar" && !value && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            Ctrl+K
          </kbd>
        )}
        {value && (
          <button
            onClick={() => {
              setValue("")
              setSuggestions([])
              inputRef.current?.focus()
            }}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10",
              variant === "hero" ? "right-4" : "right-3"
            )}
          >
            <X className={variant === "hero" ? "h-5 w-5" : "h-4 w-4"} />
          </button>
        )}

        {/* Dropdown */}
        {open && displayList.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-popover shadow-lg z-50 overflow-hidden">
            {isHistoryMode && (
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-1.5 border-b">
                <Clock className="h-3 w-3" />
                Recent searches
              </div>
            )}
            <ul>
              {displayList.map((word, i) => (
                <li key={word}>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => navigateToWord(word)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors",
                      activeIndex === i
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                  >
                    {isHistoryMode ? (
                      <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate">{word}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
)
