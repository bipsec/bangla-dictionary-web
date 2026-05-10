import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileQuestion className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">পাতাটি পাওয়া যায়নি</h2>
        <p className="text-sm text-muted-foreground font-meta">404 — Page not found</p>
      </div>
      <Button asChild>
        <Link href="/">হোমে ফিরুন</Link>
      </Button>
    </div>
  )
}
