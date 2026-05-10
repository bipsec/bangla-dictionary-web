export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function fetchWords(letter: string, page = 1, limit = 500) {
  const res = await fetch(
    `${API_URL}/dictionary/words?letter=${encodeURIComponent(letter)}&page=${page}&limit=${limit}`
  )
  if (!res.ok) throw new Error("Failed to fetch words")
  return res.json()
}

export async function fetchCompleteWords(letter: string, page = 1, limit = 500) {
  const res = await fetch(
    `${API_URL}/complete-dictionary/words?letter=${encodeURIComponent(letter)}&page=${page}&limit=${limit}`
  )
  if (!res.ok) throw new Error("Failed to fetch complete words")
  return res.json()
}

export async function fetchWordDetails(word: string) {
  const res = await fetch(`${API_URL}/dictionary/word?word=${encodeURIComponent(word)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error("Failed to fetch word details")
  return res.json()
}

export async function fetchCompleteWordDetail(word: string) {
  const res = await fetch(`${API_URL}/complete-dictionary/word?word=${encodeURIComponent(word)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error("Failed to fetch complete word details")
  return res.json()
}

export async function fetchIPA(word: string) {
  const res = await fetch(`${API_URL}/get_ipa/?word=${encodeURIComponent(word)}`)
  if (res.status === 429) throw new Error("429")
  if (!res.ok) throw new Error("Failed to fetch IPA")
  return res.json()
}
