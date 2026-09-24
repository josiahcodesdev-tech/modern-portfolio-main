"use client"

import { ExternalLink, GitPullRequest } from "lucide-react"
import { useContent } from "@/components/content-provider"
import ProjectsPanel from "@/components/projects-panel"
import Reveal from "@/components/reveal"
import CtaSection from "@/components/cta-section"



export default function ProjectsPage() {
  const { content: { openSource } } = useContent()
  return (
    <>
      <ProjectsPanel as="h1" />

      {openSource.length > 0 && (
        <section className="container mt-8">
          <Reveal className="panel p-6 md:p-10">
            <h2 className="text-center text-3xl font-bold text-fg">Open Source Contribution</h2>
            {openSource.map((item) => (
              <div key={item.project} className="mt-6 gap-5 md:flex">
                <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md bg-badge md:flex">
                  <GitPullRequest className="h-5 w-5 text-brand" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-fg">{item.project}</h3>
                  <ul className="mt-2.5 list-disc space-y-2.5 pl-5 text-dim">
                    <li>{item.description}</li>
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5">
                    {item.linkLabel} <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </Reveal>
        </section>
      )}

      <CtaSection />
    </>
  )
}
