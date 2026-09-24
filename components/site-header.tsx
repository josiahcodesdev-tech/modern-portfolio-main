"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { nav } from "@/lib/site"
import { useContent } from "@/components/content-provider"
import { cn } from "@/lib/utils"
import ThemeToggle from "@/components/theme-toggle"

export default function SiteHeader() {
  const { content: { site } } = useContent()
  const mailto = `mailto:${site.email}`
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  const logo = (
    <Link href="/" className="font-mono text-2xl font-bold text-fg">
      {site.shortName}
      <span className="text-brand">.</span>
    </Link>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink">
      <div className="container flex h-20 items-center justify-between md:h-24">
        {logo}

        <nav className="hidden items-center gap-3 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-[15px] font-semibold underline-offset-[5px] transition-colors hover:text-brand hover:underline",
                isActive(item.href) ? "text-brand" : "text-soft",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href={mailto} className="btn-outline hidden md:inline-flex">
            Hire me
          </a>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-dim text-dim md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-ink p-6 transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Mobile menu"
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-soft">Menu</p>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="text-soft">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-8 flex flex-col border-t border-dim/50">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "border-b border-dim/50 py-5 text-center font-semibold underline-offset-[5px] hover:text-brand hover:underline",
                isActive(item.href) ? "text-brand" : "text-dim",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a href={mailto} className="btn-primary mt-8">
          Hire me
        </a>
      </aside>
    </header>
  )
}
