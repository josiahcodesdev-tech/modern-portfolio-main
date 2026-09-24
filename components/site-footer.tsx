"use client"

import Link from "next/link"
import { nav } from "@/lib/site"
import { useContent } from "@/components/content-provider"
import SocialLinks from "@/components/social-links"

export default function SiteFooter() {
  const { content: { site } } = useContent()
  return (
    <footer className="site-footer mt-8 light:mt-16 light:bg-navy light:py-6">
      <div className="container pb-10 light:pb-4">
      <div className="flex flex-col items-center justify-between gap-6 border-t border-ink-line pt-8 md:flex-row light:border-transparent">
        <nav className="flex flex-wrap justify-center gap-6 text-sm" aria-label="Footer">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-dim transition hover:text-brand light:text-white/70">
              {item.label}
            </Link>
          ))}
        </nav>
        <SocialLinks />
      </div>
      <p className="mt-8 text-center text-sm text-dim light:border-t light:border-white/10 light:pt-6 light:text-white/60">
        © {new Date().getFullYear()} {site.name}. All Rights Reserved.
      </p>
      </div>
    </footer>
  )
}
