import type { Metadata } from "next"
import Image from "next/image"
import { Laptop, Mail, Quote } from "lucide-react"
import { education, experience, quote, testimonials } from "@/lib/data"
import { mailto, site } from "@/lib/site"
import Reveal from "@/components/reveal"
import CtaSection from "@/components/cta-section"

export const metadata: Metadata = {
  title: "About",
  description: `Get to know ${site.name}, a ${site.role.toLowerCase()} based in ${site.location}.`,
}

function IconBadge() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-badge">
      <Laptop className="h-6 w-6 text-brand" />
    </span>
  )
}

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="container">
        <Reveal className="flex flex-col gap-8 md:flex-row">
          <div className="panel flex flex-1 items-center p-6 md:p-8">
            <div className="relative mx-auto h-[250px] w-[250px] overflow-hidden rounded-full md:h-[300px] md:w-[300px] lg:h-[350px] lg:w-[350px]">
              <Image src={site.photo} alt={site.name} fill priority className="object-cover" />
            </div>
          </div>
          <div className="panel flex-[2] p-6 md:p-8">
            <h1 className="mt-4 text-2xl leading-snug text-fg md:text-3xl">
              I&apos;m {site.name}, a passionate {site.role}.
            </h1>
            <p className="mt-5 text-lg text-dim">
              I build websites and web applications that are fast, responsive and user-focused. I enjoy turning ideas
              into polished products, solving problems and writing code that is clean and easy to maintain.
            </p>
            <p className="mt-5 text-lg text-dim">
              I work well both independently and with teams, and I value clear communication and continuous growth. I
              care about delivering on time, on budget and to a standard my clients are proud to share.
            </p>
            <a href={mailto} className="btn-primary mt-9">
              Get in touch <Mail className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </section>

      {/* Experience */}
      <section className="container mt-8">
        <Reveal className="panel p-6 md:p-10">
          <h2 className="text-2xl font-bold text-fg">Experience</h2>
          {experience.map((job) => (
            <div key={`${job.company}-${job.date}`} className="mt-6 gap-5 md:flex">
              <div className="mb-4 flex items-center gap-3 md:mb-0 md:block">
                <IconBadge />
                <p className="text-dim md:hidden">{job.date}</p>
              </div>
              <div>
                <p className="hidden text-dim md:block">{job.date}</p>
                <p className="mt-1 text-lg text-fg">
                  {job.title}, {job.company}
                </p>
                <div className="mt-4 border-t border-ink-line pt-4">
                  <p className="text-lg text-dim">{job.summary}</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-dim marker:text-dim">
                    {job.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Education + quote */}
      <section className="container mt-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <Reveal className="panel flex-[2] p-6 md:p-10">
            <h2 className="text-2xl font-bold text-fg">Education</h2>
            {education.map((item) => (
              <div key={`${item.school}-${item.course}`} className="mt-6 flex gap-5">
                <IconBadge />
                <div className="flex-1">
                  <p className="text-dim">{item.date}</p>
                  <p className="mt-2.5 text-lg text-fg">{item.course}</p>
                  <p className="mt-2.5 text-dim">{item.school}</p>
                  <hr className="mt-7 border-ink-line" />
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.1} className="panel flex flex-1 flex-col justify-center p-6 md:p-10">
            <Quote className="h-7 w-7 rotate-180 fill-fg text-fg" aria-hidden />
            <p className="my-2 px-6 text-xl italic text-fg">{quote}</p>
            <Quote className="h-7 w-7 self-end fill-fg text-fg" aria-hidden />
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container mt-8">
          <Reveal className="panel p-6 text-center md:p-10">
            <h2 className="text-2xl font-bold text-fg">Testimonials</h2>
            {testimonials.map((t) => (
              <figure key={t.name} className="mt-8 md:mx-20">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink-raised text-lg font-semibold text-fg">
                  {t.name.charAt(0)}
                </span>
                <blockquote className="mt-5 text-lg text-dim">{t.testimonial}</blockquote>
                <figcaption className="mt-5">
                  <span className="block text-lg text-fg">{t.name}</span>
                  <span className="block text-lg text-dim">
                    {t.position}, {t.company}
                  </span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </section>
      )}

      <CtaSection />
    </>
  )
}
