import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { skillGroups } from "@/lib/data"
import Reveal from "@/components/reveal"
import CtaSection from "@/components/cta-section"

export const metadata: Metadata = {
  title: "Skills",
  description: "Technologies I use to build scalable, user-friendly web applications.",
}

export default function SkillsPage() {
  return (
    <>
      <section className="container">
        <Reveal className="panel p-6 md:p-10">
          <h1 className="text-center text-3xl font-bold text-fg">Skills</h1>
          <p className="mt-2.5 text-center text-lg text-dim">
            Technologies I&apos;ve worked with to build scalable, user-friendly web applications
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {skillGroups.map(({ icon: Icon, title, description, skills }) => (
              <div
                key={title}
                className="rounded-xl border border-ink-line bg-ink-card p-6 transition duration-300 hover:border-brand/60 md:p-10"
              >
                <Icon className="h-10 w-10 text-brand" />
                <h2 className="mt-2.5 text-xl text-fg">{title}</h2>
                <p className="mt-2.5 text-dim">{description}</p>
                <ul>
                  {skills.map((skill) => (
                    <li key={skill} className="mt-4 flex items-start gap-3 text-dim">
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      <CtaSection />
    </>
  )
}
