"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { fetchIPA } from "@/lib/api"

export function BanglaInput() {
  const [bangla, setBangla] = useState("")
  const [ipaResult, setIpaResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleIPAClick = async () => {
    if (!bangla.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchIPA(bangla)
      setIpaResult(data ?? "")
    } catch {
      setError("Failed to fetch IPA. Make sure the API server is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setBangla("")
    setIpaResult("")
    setError(null)
  }

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardContent className="pt-5 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Type in Bangla
            </label>
            <Textarea
              value={bangla}
              onChange={(e) => setBangla(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleIPAClick()
                }
              }}
              rows={4}
              placeholder="বাংলায় লিখুন..."
              className="text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {ipaResult && (
        <Card>
          <CardContent className="pt-5">
            <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
              IPA Pronunciation
            </label>
            <div className="rounded-md border bg-muted/50 p-3 text-lg font-mono">
              {ipaResult}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="text-destructive text-center text-sm">{error}</p>
      )}

      <div className="flex justify-center gap-3">
        <Button onClick={handleIPAClick} disabled={loading || !bangla.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </>
          ) : (
            "Generate IPA"
          )}
        </Button>
        <Button onClick={handleClear} variant="outline" disabled={!bangla}>
          Clear
        </Button>
      </div>
    </div>
  )
}
