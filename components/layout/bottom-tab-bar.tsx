"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  Languages,
  Package,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { title: "Home", href: "/", icon: Home },
  { title: "Browse", href: "/browse", icon: BookOpen },
  { title: "IPA", href: "/ipa", icon: Languages },
  { title: "PyPI", href: "/module", icon: Package },
  { title: "Help", href: "/instructions", icon: HelpCircle },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
      <div className="flex h-16 items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <tab.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              {tab.title}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
