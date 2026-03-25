"use client"

import Link from "next/link"
import { HelpCircle, Search, BookOpen, Languages } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

const steps = [
  {
    icon: Search,
    title: "Search a word",
    description: "Use the search bar at the top to look up any Bangla or English word instantly.",
  },
  {
    icon: BookOpen,
    title: "Browse by letter",
    description: "Go to Browse and select a Bengali letter to see all words starting with it.",
  },
  {
    icon: Languages,
    title: "Generate IPA",
    description: "Use the IPA Translator to convert Bangla text into phonetic notation.",
  },
]

const faqData = [
  {
    id: "1",
    title: "How to use this dictionary?",
    content: "Use the search bar to find any word, or browse by letter in the Browse section. Each word shows its meaning, part of speech, and IPA pronunciation.",
  },
  {
    id: "2",
    title: "How to generate IPA?",
    content: "Go to the IPA Translator page. You can type text directly (Normal or Avro mode) or upload a .txt file. Click the IPA button to generate the phonetic representation.",
  },
  {
    id: "3",
    title: "What makes this dictionary different?",
    content: "This dictionary provides IPA pronunciation, Avro phonetic typing support, and a comprehensive Bengali word database with meanings and parts of speech.",
  },
  {
    id: "4",
    title: "Is this dictionary free?",
    content: "Yes, this dictionary is completely free to use. Enjoy exploring the Bengali language!",
  },
]

export default function InstructionsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Help & Instructions</h1>
          <p className="text-sm text-muted-foreground">
            Learn how to get the most out of Bangla Dictionary
          </p>
        </div>
      </div>

      {/* Getting Started */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Getting Started</h2>
        <div className="grid gap-4">
          {steps.map((step, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 pt-4 pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <step.icon className="h-4 w-4 text-primary" />
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="text-center space-y-3 pb-4">
        <p className="text-muted-foreground">Want to use this dictionary in your own projects?</p>
        <Button asChild>
          <Link href="/module">
            Check out the PyPI Package
          </Link>
        </Button>
      </section>
    </div>
  )
}
