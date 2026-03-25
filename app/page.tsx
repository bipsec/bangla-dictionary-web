import Link from "next/link"
import { BookOpen, Languages, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBox } from "@/components/layout/search-box"

const quickLinks = [
  {
    title: "Browse by Letter",
    description: "Explore words organized by Bengali alphabet",
    href: "/browse",
    icon: BookOpen,
  },
  {
    title: "IPA Translator",
    description: "Convert Bangla text to phonetic notation",
    href: "/ipa",
    icon: Languages,
  },
  {
    title: "PyPI Package",
    description: "Use BanglaDictionary in your Python projects",
    href: "/module",
    icon: Package,
  },
]

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6 pt-8 pb-4 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Bangla Dictionary
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Your comprehensive resource for Bengali language — search words,
            explore meanings, and learn pronunciation.
          </p>
        </div>
        <SearchBox variant="hero" />
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full border-primary/20 bg-primary/5 transition-all hover:bg-primary/10 hover:shadow-md hover:border-primary/50">
              <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <link.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{link.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {/* Brief About */}
      <section className="text-center max-w-2xl mx-auto space-y-2">
        <p className="text-muted-foreground">
          Access bilingual search, detailed definitions, IPA pronunciation, and
          more. Whether you&apos;re a student, traveler, or language enthusiast
          — start exploring the beauty of Bengali today.
        </p>
      </section>
    </div>
  )
}
