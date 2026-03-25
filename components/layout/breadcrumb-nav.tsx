"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function BreadcrumbContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (pathname === "/") return null

  const crumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
  ]

  if (pathname === "/browse") {
    crumbs.push({ label: "Browse" })
  } else if (pathname === "/browse/list-of-words") {
    const letter = searchParams.get("letter")
    crumbs.push({ label: "Browse", href: "/browse" })
    crumbs.push({ label: letter || "Letter" })
  } else if (pathname === "/word-details") {
    const word = searchParams.get("word")
    const firstLetter = word?.charAt(0)
    crumbs.push({ label: "Browse", href: "/browse" })
    if (firstLetter) {
      crumbs.push({
        label: firstLetter,
        href: `/browse/list-of-words?letter=${firstLetter}`,
      })
    }
    crumbs.push({ label: word || "Word" })
  } else if (pathname === "/ipa") {
    crumbs.push({ label: "IPA Translator" })
  } else if (pathname === "/instructions") {
    crumbs.push({ label: "Help & Instructions" })
  } else if (pathname === "/module") {
    crumbs.push({ label: "PyPI Package" })
  }

  if (crumbs.length <= 1) return null

  return (
    <div className="border-b bg-muted/30 px-4">
      <div className="mx-auto max-w-6xl py-2">
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, i) => (
              <span key={i} className="contents">
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.href && i < crumbs.length - 1 ? (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}

export function BreadcrumbNav() {
  return (
    <Suspense fallback={null}>
      <BreadcrumbContent />
    </Suspense>
  )
}
