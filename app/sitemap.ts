import { MetadataRoute } from "next"

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://riddhidictionary.com"

const staticRoutes = [
  { url: `${BASE}/`, priority: 1.0 },
  { url: `${BASE}/browse`, priority: 0.9 },
  { url: `${BASE}/complete-dictionary`, priority: 0.9 },
  { url: `${BASE}/pouranik-utso`, priority: 0.8 },
  { url: `${BASE}/ipa`, priority: 0.7 },
  { url: `${BASE}/instructions`, priority: 0.5 },
  { url: `${BASE}/module`, priority: 0.5 },
]

const banglaLetters = "অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ"

export default function sitemap(): MetadataRoute.Sitemap {
  const letterRoutes = banglaLetters.split("").map((letter) => ({
    url: `${BASE}/browse/list-of-words?letter=${encodeURIComponent(letter)}`,
    priority: 0.6,
  }))

  return [...staticRoutes, ...letterRoutes]
}
