const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

export async function fetchWords(letter: string, page = 1, limit = 500) {
  const res = await fetch(
    `${API_URL}/dictionary/words?letter=${letter}&page=${page}&limit=${limit}`
  )
  if (!res.ok) throw new Error("Failed to fetch words")
  return res.json()
}

export async function fetchWordDetails(word: string) {
  const res = await fetch(`${API_URL}/dictionary/word?word=${word}`)
  if (!res.ok) throw new Error("Failed to fetch word details")
  return res.json()
}

export async function fetchIPA(word: string) {
  const res = await fetch(`${API_URL}/get_ipa/?word=${word}`)
  if (!res.ok) throw new Error("Failed to fetch IPA")
  return res.json()
}
