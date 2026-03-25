"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  BookOpen,
  Home,
  Languages,
  Package,
  HelpCircle,
  Moon,
  Sun,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBox } from "./search-box"
import { SearchOverlay } from "./search-overlay"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "Browse", href: "/browse", icon: BookOpen },
  { title: "IPA", href: "/ipa", icon: Languages },
  { title: "PyPI", href: "/module", icon: Package },
  { title: "Help", href: "/instructions", icon: HelpCircle },
]

export function TopNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-primary shrink-0">
            <BookOpen className="h-5 w-5" />
            <span className="hidden sm:inline text-lg">Bangla Dictionary</span>
            <span className="sm:hidden text-lg">BD</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-nav-active text-nav-active-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop search */}
          <div className="hidden lg:block w-80">
            <SearchBox variant="navbar" />
          </div>

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
