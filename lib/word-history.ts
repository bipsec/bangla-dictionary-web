const STORAGE_KEY = "bangla-dict-history"
const MAX_ITEMS = 20

export function getWordHistory(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addWordToHistory(word: string) {
  if (typeof window === "undefined") return
  const trimmed = word.trim()
  if (!trimmed) return
  try {
    const history = getWordHistory().filter((w) => w !== trimmed)
    history.unshift(trimmed)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ITEMS)))
  } catch {
    // localStorage unavailable
  }
}

export function clearWordHistory() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable
  }
}
