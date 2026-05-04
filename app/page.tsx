"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Languages, Package, Library, Clock, X, BookMarked, Scroll } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchBox } from "@/components/layout/search-box"
import { getWordHistory, clearWordHistory } from "@/lib/word-history"

const references = [
  { name: "অভিগম্য অভিধান",               nameEn: "Abhigamya Abhidhan",                        author: "",                         publisher: "",                      key: "accessible_ovidhan" },
  { name: "আধুনিক বাংলা অভিধান",           nameEn: "Adhunik Bangla Abhidhan",                   author: "Jamil Chowdhury",          publisher: "বাংলা একাডেমি, ঢাকা",  key: "bangla_academy_ovidhan",    year: "২০১৬" },
  { name: "ব্যবহারিক বাংলা অভিধান",        nameEn: "Byabaharik Bangla Abhidhan",                author: "",                         publisher: "বাংলা একাডেমি, ঢাকা",  key: "beboharik_bangla_ovidhan" },
  { name: "বিবর্তনমূলক বাংলা অভিধান",     nameEn: "Bibartanmulak Bangla Abhidhan",             author: "Golam Murshid (সম্পাদক)", publisher: "বাংলা একাডেমি, ঢাকা",  key: "bibartanmulak_ovidhan" },
  { name: "এনসাইক্লোপিডিয়া বাংলা অভিধান",nameEn: "Encyclopedia Bangla Abhidhan",              author: "",                         publisher: "",                      key: "online_eb_ovidhan" },
  { name: "সংক্ষিপ্ত বাংলা অভিধান",        nameEn: "Bangla Academy Samkshipta Bangla Abhidhan", author: "Ahmed Sharif (সম্পাদক)",  publisher: "বাংলা একাডেমি, ঢাকা",  key: "samkshipta_bangla_abhidhan", year: "১৯৯২" },
  { name: "সংসদ বাংলা অভিধান",             nameEn: "Samsad Bangla Abhidhan",                    author: "শৈলেন্দ্র বিশ্বাস",        publisher: "সাহিত্য সংসদ, কলকাতা", key: "samsad_ovidhan" },
  { name: "বাংলা উচ্চারণ অভিধান",          nameEn: "Bangla Uccharon Abhidhan",                  author: "Naren Bishwas",            publisher: "বাংলা একাডেমি, ঢাকা",  key: "bangla_uccharon_ovidhan",   year: "১৯৯০" },
  { name: "বাংলা শব্দের পৌরাণিক উৎস",      nameEn: "Bangla Sobder Pouranik Uthsho",             author: "Dr. Mohammad Amin",        publisher: "",                      key: "bangla_sobder_pouranik_uthsho" },
  { name: "সংসদ সমার্থশব্দকোষ",            nameEn: "Samsad Samarthoshabdokosh",                 author: "Ashok Mukhopadhyay",       publisher: "সাহিত্য সংসদ, কলকাতা", key: "samsad_samarthoshabdokosh", year: "১৯৮৭" },
  { name: "অন্ত্যমিল অভিধান",              nameEn: "Antomil Abhidhan",                          author: "Dipongkor Chakroborty",    publisher: "",                      key: "antomil_ovidhan" },
]

const quickLinks = [
  { title: "ব্রাউজ",          titleEn: "Browse",           href: "/browse",               icon: BookOpen   },
  { title: "সম্পূর্ণ অভিধান", titleEn: "Complete Dict",    href: "/complete-dictionary",  icon: BookMarked },
  { title: "পৌরাণিক উৎস",    titleEn: "Pouranic",         href: "/pouranik-utso",        icon: Scroll     },
  { title: "IPA",             titleEn: "IPA Translator",   href: "/ipa",                  icon: Languages  },
  { title: "PyPI",            titleEn: "Python Package",   href: "/module",               icon: Package    },
]

export default function Home() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    setHistory(getWordHistory())
  }, [])

  const handleClearHistory = () => {
    clearWordHistory()
    setHistory([])
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Hero */}
      <section className="flex flex-col items-center gap-4 pt-6 text-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">বাংলা অভিধান</h1>
          <p className="text-sm text-muted-foreground font-meta mt-1">Riddhi Abhidhan · Search, Browse & Explore</p>
        </div>
        <SearchBox variant="hero" />
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-5 gap-2">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-2 py-3 text-center transition-all hover:bg-primary/10 hover:border-primary/40 hover:shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <link.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{link.title}</p>
              <p className="font-meta text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{link.titleEn}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Recent Searches */}
      {history.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">সাম্প্রতিক অনুসন্ধান</span>
            </div>
            <button onClick={handleClearHistory} className="flex items-center gap-1 font-meta text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3 w-3" /> মুছুন
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.slice(0, 12).map((word) => (
              <Link key={word} href={`/word-details?word=${word}`}>
                <Badge variant="secondary" className="text-sm px-3 py-1 cursor-pointer transition-colors hover:bg-primary/20 hover:text-primary">
                  {word}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      <section className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Library className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">উৎস অভিধানসমূহ</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {references.map((ref) => (
            <div key={ref.key} className="flex flex-col gap-0.5 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2.5">
              <p className="text-[13px] font-semibold leading-snug">{ref.name}</p>
              <p className="font-meta text-[10px] text-muted-foreground">{ref.nameEn}</p>
              {ref.author && (
                <p className="font-meta text-[10px] text-muted-foreground/60 truncate">{ref.author}</p>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
