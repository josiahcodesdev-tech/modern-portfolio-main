"use client"

import Link from "next/link"
import { nav } from "@/lib/site"
import { useContent } from "@/components/content-provider"
import SocialLinks from "@/components/social-links"

export default function SiteFooter() {
  const { content: { site } } = useContent()
  return (
    <footer className="container mt-8 pb-10">
      <div className="flex flex-col items-center justify-between gap-6 border-t border-ink-line pt-8 md:flex-row">
        <nav className="flex flex-wrap justify-center gap-6 text-sm" aria-label="Footer">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-dim transition hover:text-brand">
              {item.label}
            </Link>
          ))}
        <Link href="/admin" className="text-dim transition hover:text-brand">Admin</Link>
        </nav>
        <SocialLinks />
      </div>
      <p className="mt-8 text-center text-sm text-dim">
        © {new Date().getFullYear()} {site.name}. All Rights Reserved.
      </p>
    </footer>
  )
}
