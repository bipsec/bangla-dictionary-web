"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  BookMarked,
  Scroll,
  Languages,
  Package,
  HelpCircle,
  MoreHorizontal,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const primaryTabs = [
  { title: "Home",     href: "/",                    icon: Home       },
  { title: "Browse",   href: "/browse",              icon: BookOpen   },
  { title: "সম্পূর্ণ", href: "/complete-dictionary", icon: BookMarked },
  { title: "পৌরাণিক", href: "/pouranik-utso",        icon: Scroll     },
  { title: "IPA",      href: "/ipa",                 icon: Languages  },
]

const overflowTabs = [
  { title: "PyPI",  href: "/module",       icon: Package    },
  { title: "Help",  href: "/instructions", icon: HelpCircle },
]

export function BottomTabBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isOverflowActive = overflowTabs.some(
    (t) => pathname === t.href || pathname.startsWith(t.href)
  )

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="flex h-16 items-center justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          {primaryTabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/" && pathname.startsWith(tab.href))
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors min-w-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <tab.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span className="truncate max-w-[44px]">{tab.title}</span>
              </Link>
            )
          })}

          <button
            onClick={() => setOpen(true)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors min-w-0",
              isOverflowActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t bg-background px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-foreground">More</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 pb-2">
              {overflowTabs.map((tab) => {
                const isActive = pathname === tab.href || pathname.startsWith(tab.href)
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <tab.icon className={cn("h-6 w-6", isActive && "stroke-[2.5]")} />
                    {tab.title}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
