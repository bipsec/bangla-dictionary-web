const SOURCE_STYLES: Record<string, { bg: string; dot: string; text: string }> = {
  "ব্যবহারিক বাংলা অভিধান":        { bg: "#dbeafe", dot: "#3b82f6", text: "#1e40af" },
  "অভিগম্য অভিধান":                 { bg: "#dcfce7", dot: "#22c55e", text: "#166534" },
  "বাংলা একাডেমি অভিধান":           { bg: "#fef9c3", dot: "#eab308", text: "#854d0e" },
  "আধুনিক বাংলা অভিধান":            { bg: "#fef9c3", dot: "#eab308", text: "#854d0e" },
  "বিবর্তনমূলক বাংলা অভিধান":      { bg: "#f3e8ff", dot: "#a855f7", text: "#6b21a8" },
  "এনসাইক্লোপিডিয়া বাংলা অভিধান": { bg: "#ffedd5", dot: "#f97316", text: "#9a3412" },
  "সংক্ষিপ্ত বাংলা অভিধান":         { bg: "#fce7f3", dot: "#ec4899", text: "#9d174d" },
  "সংসদ বাংলা অভিধান":              { bg: "#e0f2fe", dot: "#0ea5e9", text: "#075985" },
}

const FALLBACK = { bg: "#f1f5f9", dot: "#94a3b8", text: "#475569" }

interface SourceBadgeProps {
  source: string
  size?: "sm" | "md"
}

export function SourceBadge({ source, size = "sm" }: SourceBadgeProps) {
  const style = SOURCE_STYLES[source] ?? FALLBACK
  const textClass = size === "md" ? "text-[12px]" : "text-[10px]"

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-bengali font-medium ${textClass}`}
      style={{ background: style.bg, color: style.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: style.dot }} />
      {source}
    </span>
  )
}
