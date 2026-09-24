"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, ExternalLink, Github } from "lucide-react"
import { useContent } from "@/components/content-provider"
import { ProjectImage } from "@/components/project-card"
import Reveal from "@/components/reveal"
import CtaSection from "@/components/cta-section"

export default function ProjectContent({ slug }: { slug: string }) {
  const { content: { projects }, ready } = useContent()
  const project = projects.find(p => p.slug === slug)
  if (!project) return (
    <section className="container panel p-10">
      <h1 className="text-2xl font-bold">{ready ? "Project not found" : "Loading project..."}</h1>
      <p className="mt-3 text-dim">{ready ? "This project is not available in this browser." : "Checking your saved projects."}</p>
      <Link className="btn-primary mt-6" href="/projects">All projects</Link>
    </section>
  )
  return (
    <>
      <section className="container">
        <Reveal className="panel p-6 md:p-10">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-dim transition hover:text-brand">
            <ArrowLeft className="h-4 w-4" /> All Projects
          </Link>
          <h1 className="mt-4 text-center text-3xl font-bold text-fg">{project.title}</h1>
          <ProjectImage project={project} interactive className="mx-auto mt-8 max-w-4xl" />
          {project.images && project.images.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {project.images.map((src) => (
                <ProjectImage key={src} project={project} src={src} />
              ))}
            </div>
          )}
        </Reveal>
      </section>

      <section className="container mt-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <Reveal className="panel flex-1 p-6 md:p-10">
            <h2 className="text-xl font-bold text-fg">Tools</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {project.tools.map((tool) => (
                <li key={tool} className="pill">
                  {tool}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="panel flex-[2] p-6 md:p-10">
            <h2 className="text-xl font-bold text-fg">Description</h2>
            <p className="mt-4 text-lg text-dim">{project.fullDescription}</p>
            {(project.liveLink || project.githubLink) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Live Link <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Github <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="container mt-8">
        <Reveal className="panel p-6 md:p-10">
          <h2 className="text-xl font-bold text-fg">Deliverables</h2>
          <ul className="mt-6 space-y-4">
            {project.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3 text-lg text-dim">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand" />
                {d}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <CtaSection />
    </>
  )
}
