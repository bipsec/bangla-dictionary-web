"use client"

import Link from "next/link"
import { HelpCircle, Search, BookOpen, Languages, BookMarked, Scroll, Package } from "lucide-react"
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
    title: "শব্দ খুঁজুন",
    titleEn: "Search a Word",
    description: "উপরের সার্চ বারে যেকোনো বাংলা বা ইংরেজি শব্দ টাইপ করুন। সঙ্গে সঙ্গে ফলাফল পাবেন।",
  },
  {
    icon: BookOpen,
    title: "বর্ণ দিয়ে ব্রাউজ করুন",
    titleEn: "Browse by Letter",
    description: "ব্রাউজ পেজে যান এবং একটি বাংলা বর্ণ নির্বাচন করুন — সেই বর্ণ দিয়ে শুরু সব শব্দ দেখুন।",
  },
  {
    icon: BookMarked,
    title: "সম্পূর্ণ অভিধান",
    titleEn: "Complete Dictionary",
    description: "একাধিক অভিধান থেকে একত্রিত শব্দের অর্থ, IPA উচ্চারণ ও উৎস সহ দেখুন।",
  },
  {
    icon: Scroll,
    title: "পৌরাণিক উৎস",
    titleEn: "Pouranic Origin",
    description: "বাংলা শব্দের পৌরাণিক ও পুরাণভিত্তিক ব্যাখ্যা জানুন।",
  },
  {
    icon: Languages,
    title: "IPA ট্রান্সলেটর",
    titleEn: "IPA Translator",
    description: "IPA পেজে গিয়ে বাংলা লেখাকে ফোনেটিক নোটেশনে রূপান্তর করুন।",
  },
  {
    icon: Package,
    title: "PyPI প্যাকেজ",
    titleEn: "PyPI Package",
    description: "আপনার Python প্রজেক্টে BanglaDictionary ব্যবহার করুন।",
  },
]

const faqData = [
  {
    id: "1",
    question: "এই অভিধান কীভাবে ব্যবহার করবেন?",
    answer: "সার্চ বার ব্যবহার করে যেকোনো শব্দ খুঁজুন, অথবা ব্রাউজ সেকশনে বর্ণ নির্বাচন করে শব্দ দেখুন। প্রতিটি শব্দের অর্থ, পদ পরিচয় এবং IPA উচ্চারণ পাওয়া যাবে।",
  },
  {
    id: "2",
    question: "IPA কীভাবে তৈরি করবেন?",
    answer: "IPA ট্রান্সলেটর পেজে যান। সরাসরি টাইপ করুন (Normal বা Avro মোডে) অথবা .txt ফাইল আপলোড করুন। IPA বাটনে ক্লিক করলে ফোনেটিক রূপান্তর পাবেন।",
  },
  {
    id: "3",
    question: "এই অভিধান অন্যদের থেকে আলাদা কেন?",
    answer: "এই অভিধানে একাধিক বাংলা অভিধানের (ব্যবহারিক বাংলা অভিধান, সংসদ, বিবর্তনমূলক সহ ৭টি উৎস) তথ্য একত্রিত করা হয়েছে। IPA উচ্চারণ, Avro ফোনেটিক ইনপুট এবং পৌরাণিক উৎস সহ বিস্তারিত তথ্য পাওয়া যায়।",
  },
  {
    id: "4",
    question: "কোন কোন অভিধান ব্যবহার করা হয়েছে?",
    answer: "ব্যবহারিক বাংলা অভিধান, আধুনিক বাংলা অভিধান, সংসদ বাংলা অভিধান, বিবর্তনমূলক বাংলা অভিধান, সংক্ষিপ্ত বাংলা অভিধান, এনসাইক্লোপিডিয়া বাংলা অভিধান এবং অভিগম্য অভিধান।",
  },
  {
    id: "5",
    question: "এই অভিধান কি বিনামূল্যে?",
    answer: "হ্যাঁ, এই অভিধান সম্পূর্ণ বিনামূল্যে ব্যবহার করা যায়।",
  },
  {
    id: "6",
    question: "Python প্রজেক্টে কীভাবে ব্যবহার করবেন?",
    answer: "pip install bangla-dictionary কমান্ড দিয়ে প্যাকেজটি ইনস্টল করুন। PyPI পেজে বিস্তারিত ডকুমেন্টেশন ও উদাহরণ কোড পাবেন।",
  },
]

export default function InstructionsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">সাহায্য ও নির্দেশিকা</h1>
          <p className="text-sm text-muted-foreground font-meta">Help & Instructions</p>
        </div>
      </div>

      {/* Getting Started */}
      <section className="space-y-4">
        <h2 className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">শুরু করুন</h2>
        <div className="rounded-xl overflow-hidden border divide-y divide-border/50">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 px-4 py-4 bg-card">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mt-0.5">
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-semibold text-[15px]">{step.title}</h3>
                  <span className="font-meta text-[11px] text-muted-foreground">{step.titleEn}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="font-meta text-[11px] uppercase tracking-widest text-muted-foreground">সাধারণ প্রশ্ন</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left font-semibold text-[15px]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="text-center space-y-3 pb-4">
        <p className="text-muted-foreground text-sm">আপনার প্রজেক্টে এই অভিধান ব্যবহার করতে চান?</p>
        <Button asChild>
          <Link href="/module">
            PyPI প্যাকেজ দেখুন
          </Link>
        </Button>
      </section>
    </div>
  )
}
