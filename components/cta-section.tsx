import { MessageCircle } from "lucide-react"
import { mailto, whatsappLink } from "@/lib/site"
import Reveal from "@/components/reveal"

export default function CtaSection() {
  const whatsapp = whatsappLink("Hi Josiah, I'd like to talk about a project.")

  return (
    <section className="container mt-8">
      <Reveal className="panel px-4 py-14 text-center sm:px-10">
        <h2 className="mx-auto max-w-2xl text-3xl text-fg md:text-4xl">
          Are you ready to kickstart your project with a touch of magic?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dim">
          Reach out and let&apos;s make it happen. I&apos;m also available for full-time or part-time opportunities
          where I can push the limits of code and deliver exceptional work.
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
