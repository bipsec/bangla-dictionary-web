/**
 * Client for this app's own API routes (app/api/**). The routes are same-origin, so these
 * are relative paths — there is no separate backend service to configure.
 */

async function get<T>(path: string, { notFoundAsNull = false } = {}): Promise<T | null> {
  const res = await fetch(path)
  if (notFoundAsNull && res.status === 404) return null
  if (res.status === 429) throw new Error("429")
  if (!res.ok) throw new Error(`Request failed: ${path} (${res.status})`)
  return (await res.json()) as T
}

export interface WordItem {
  id: number
  word: string
}

/** A meaning row from the enriched (complete) dictionary. */
export interface CompleteMeaning {
  id: number
  /**
   * Optional: the loader joins a source entry's multiple definitions into `meaning` with
   * "; ", so the API does not send this. The renderers list definitions individually when
   * it is present and fall back to `meaning` when it isn't.
   */
  definitions?: string[]
  // Every column below is nullable in the database; the UI treats null and "" alike.
  meaning: string | null
  pos: string | null
  pos_full: string | null
  pronunciation: string | null
  ipa: string | null
  root_lang: string | null
  topic_marker: string | null
  example: string | null
  synonyms: string[]
  page: string | null
  source: string | null
}

export interface CompleteWordDetail {
  word: string
  ipa: string
  female_marker: string | null
  antonyms: string[]
  rhyme_words: string[]
  english: string[]
  pouranic_source: string | null
  meanings: CompleteMeaning[]
}

/** A meaning row from the Byabaharik Bangla Abhidhan (word_meaning) table. */
export interface DictionaryMeaning {
  id: number
  meaning_no: string | null
  meaning: string
  pos: string | null
  spelling: string | null
  language: string | null
  sentence: string | null
  source: string | null
}

export interface DictionaryWordDetail {
  word: string
  ipa: string
  meanings: DictionaryMeaning[]
}

export interface PouranikWordDetail {
  word: string
  entries: { id: number; description: string }[]
}

export async function fetchWords(letter: string, page = 1, limit = 500) {
  return get<WordItem[]>(
    `/api/dictionary/words?letter=${encodeURIComponent(letter)}&page=${page}&limit=${limit}`
  ) as Promise<WordItem[]>
}

export async function fetchCompleteWords(letter: string, page = 1, limit = 500) {
  return get<WordItem[]>(
    `/api/complete-dictionary/words?letter=${encodeURIComponent(letter)}&page=${page}&limit=${limit}`
  ) as Promise<WordItem[]>
}

export async function fetchWordDetails(word: string) {
  return get<DictionaryWordDetail>(`/api/dictionary/word?word=${encodeURIComponent(word)}`, {
    notFoundAsNull: true,
  })
}

export async function fetchCompleteWordDetail(word: string) {
  return get<CompleteWordDetail>(`/api/complete-dictionary/word?word=${encodeURIComponent(word)}`, {
    notFoundAsNull: true,
  })
}

export async function fetchPouranikWords(letter: string, page = 1, limit = 10) {
  return get<WordItem[]>(
    `/api/pouranik-utso/words?letter=${encodeURIComponent(letter)}&page=${page}&limit=${limit}`
  ) as Promise<WordItem[]>
}

export async function fetchPouranikWordDetail(word: string) {
  return get<PouranikWordDetail>(`/api/pouranik-utso/word?word=${encodeURIComponent(word)}`, {
    notFoundAsNull: true,
  })
}

export async function fetchIPA(word: string) {
  return get<{ word: string; ipa: string; source: string }>(
    `/api/ipa?word=${encodeURIComponent(word)}`
  )
}
