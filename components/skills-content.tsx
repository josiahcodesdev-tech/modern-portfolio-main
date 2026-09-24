"use client"

import { Code2, Server, Wrench, ArrowRight } from "lucide-react"
import { useContent } from "@/components/content-provider"
import Reveal from "@/components/reveal"
import CtaSection from "@/components/cta-section"

const icons = { code: Code2, server: Server, tools: Wrench }
export default function SkillsPage() {
  const { content: { skillGroups: groups, copy } } = useContent()
  const skillGroups = groups.map(group => ({ ...group, icon: icons[group.icon] }))
  return (
    <>
      <section className="container">
        <Reveal className="panel p-6 md:p-10">
          <h1 className="text-center text-3xl font-bold text-fg">Skills</h1>
          <p className="mt-2.5 text-center text-lg text-dim">
            {copy.skillsIntro}
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
