import type { Metadata } from "next"
import { Source_Sans_3 } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TopNav } from "@/components/layout/top-nav"
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav"
import { BottomTabBar } from "@/components/layout/bottom-tab-bar"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

const font = Source_Sans_3({ subsets: ["latin", "latin-ext"] })

export const metadata: Metadata = {
  title: "Bangla Dictionary",
  description: "A comprehensive online Bangla dictionary",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <TopNav />
            <BreadcrumbNav />
            <main className="flex-1 pb-20 lg:pb-0">
              <div className="mx-auto max-w-6xl px-4 py-6">
                {children}
              </div>
            </main>
            <Footer />
            <BottomTabBar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
