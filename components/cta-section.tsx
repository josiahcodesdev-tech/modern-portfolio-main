"use client"

import { MessageCircle } from "lucide-react"
import { useContent } from "@/components/content-provider"
import Reveal from "@/components/reveal"

export default function CtaSection() {
  const { content: { site, copy } } = useContent()
  const mailto = `mailto:${site.email}`
  const whatsapp = site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi ${site.shortName}, I would like to talk about a project.`)}` : ""

  return (
    <section className="container mt-8">
      <Reveal className="panel px-4 py-14 text-center sm:px-10">
        <h2 className="mx-auto max-w-2xl text-3xl text-fg md:text-4xl">
          {copy.ctaTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dim">
          {copy.ctaBody}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={mailto} className="btn-primary">
            Let&apos;s Talk
          </a>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          )}
        </div>
      </Reveal>
    </section>
  )
}
