import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { projects } from "@/lib/data"
import ProjectCard from "@/components/project-card"
import Reveal from "@/components/reveal"

// Projects grid shared by the home page (first 3 + "View All") and the Projects page (all).
export default function ProjectsPanel({ limit, as: Heading = "h2" }: { limit?: number; as?: "h1" | "h2" }) {
  const list = limit ? projects.slice(0, limit) : projects

  return (
    <section className="container mt-8">
      <Reveal className="panel px-4 py-10 sm:px-10">
        <Heading className="text-center text-3xl font-bold text-fg">Projects</Heading>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-dim">
          A glimpse into what I&apos;ve been building, driven by curiosity and a passion for creating practical web
          applications.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {list.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        {limit && projects.length > limit && (
          <div className="mt-10 text-center">
            <Link href="/projects" className="btn-primary">
              View All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Reveal>
    </section>
  )
}
