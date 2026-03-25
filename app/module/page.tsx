"use client"

import { useState } from "react"
import { Package, Copy, Check, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const codeExamples = [
  {
    title: "Get the meaning of a word",
    code: `from bangla_dictionary.dictionary import BanglaDictionary

bd = BanglaDictionary()

meaning = bd.get_meaning("অই")
print(meaning)
# Output: {"২": ["পদ্যে ছন্দের খাতিরে নির্দেশক স্বরবর্ণ 'ঐ' কখনো কখনো 'অই' রুপে ব্যবহৃত হয়", "স্মরণ সম্বোধন ও আক্ষেপাদি সূচক"], "১": ["অদূরে বা সম্মুখবর্তী কোনো কিছু নির্দেশে ", "নির্দিষ্ট", "উল্লিখিত", "সেই"]}`,
  },
  {
    title: "Get the pronunciation of a word",
    code: `pronunciation = bd.get_pronunciation("অংগুষ্ঠানা")
print(pronunciation)
# Output: "ওঙ্গুশঠানা"`,
  },
  {
    title: "Get an example sentence",
    code: `example = bd.get_example("অকাজ")
print(example)
# Output: "সে হলো অকাজের কাজী।"`,
  },
  {
    title: "Get the part of speech (POS)",
    code: `pos = bd.get_pos("অকাট্য")
print(pos)
# Output: "বিণ"`,
  },
  {
    title: "Get the type of word",
    code: `word_type = bd.get_type("অঋণ")
print(word_type)
# Output: "অর্থ [অর্থনৈতিক]"`,
  },
  {
    title: "Get the source of a word",
    code: `source = bd.get_source("অকাণ্ড")
print(source)
# Output: "ব্যবহারিক বাংলা অভিধান"`,
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  )
}

export default function PypiPackagePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">PyPI Package</h1>
          <p className="text-sm text-muted-foreground">
            Use BanglaDictionary in your own Python projects
          </p>
        </div>
      </div>

      {/* About */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge>bangla-dictionary</Badge>
            <Badge variant="outline">Python</Badge>
            <Badge variant="secondary">MIT License</Badge>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            BanglaDictionary is a Python package that provides a dictionary for the Bengali (Bangla) language.
            It allows you to retrieve meanings, pronunciations, examples, parts of speech, types, and sources
            of words in the Bengali language. It also enables you to build a dictionary from Bangla and all
            other contents from a Bangla dictionary, allowing users to create an online dictionary from scratch
            and adapt it to other languages.
          </p>
        </CardContent>
      </Card>

      {/* Installation */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          Installation
        </h2>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-mono bg-muted px-3 py-2 rounded-md flex-1">
                pip install bangla-dictionary
              </code>
              <CopyButton text="pip install bangla-dictionary" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Start */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Quick Start</h2>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between gap-2">
              <pre className="text-sm font-mono bg-muted p-3 rounded-md overflow-x-auto flex-1">
                <code>{`from bangla_dictionary.dictionary import BanglaDictionary\n\nbd = BanglaDictionary()`}</code>
              </pre>
              <CopyButton text={`from bangla_dictionary.dictionary import BanglaDictionary\n\nbd = BanglaDictionary()`} />
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Code Examples */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Usage Examples</h2>
        {codeExamples.map((example, i) => (
          <Card key={i}>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {example.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-start justify-between gap-2">
                <pre className="text-sm font-mono bg-muted p-3 rounded-md overflow-x-auto flex-1">
                  <code>{example.code}</code>
                </pre>
                <CopyButton text={example.code} />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Separator />

      {/* License */}
      <section className="text-center space-y-2 pb-4">
        <Badge variant="secondary" className="text-sm">MIT License</Badge>
        <p className="text-sm text-muted-foreground">
          The BanglaDictionary package is released under the MIT License. You are free to use, modify,
          and distribute this package in your own projects.
        </p>
      </section>
    </div>
  )
}
