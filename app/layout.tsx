import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ThemeProvider from "@/components/theme-provider"
import { ContentProvider } from "@/components/content-provider"
import { getPublishedContent } from "@/lib/content-server"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const { content: { site } } = await getPublishedContent()
  return {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Josiah Mwangi",
    "web developer Nairobi",
    "web developer Kenya",
    "React developer",
    "Next.js developer",
    "portfolio",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} | ${site.role}`,
    description: site.description,
    type: "website",
    locale: "en_KE",
  },
}

}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initial = await getPublishedContent()
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans">
        <ThemeProvider>
          <ContentProvider initial={initial}>
            <SiteHeader />
            <main className="flex-1 pt-24 md:pt-28">{children}</main>
            <SiteFooter />
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
