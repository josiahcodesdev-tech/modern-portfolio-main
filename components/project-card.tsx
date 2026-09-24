import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink, Globe } from "lucide-react"
import type { Project } from "@/lib/data"
import { cn } from "@/lib/utils"
import LivePreview from "@/components/live-preview"

export const displayUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "")

export function ProjectImage({
  project,
  src,
  interactive = false,
  className,
}: {
  project: Project
  src?: string
  interactive?: boolean
  className?: string
}) {
  const image = src ?? project.image

  // Live site scaled down, with the screenshot (if any) shown until it loads.
  if (!src && project.liveLink) {
    return (
      <LivePreview url={project.liveLink} title={project.title} poster={image} interactive={interactive} className={className} />
    )
  }

  if (image) {
    return (
      <div className={cn("relative aspect-[16/10] overflow-hidden rounded-[10px] bg-ink", className)}>
        <Image src={image} alt={`${project.title} screenshot`} fill className="object-cover object-top" />
      </div>
    )
  }

  // Styled browser-window placeholder until a real screenshot is added.
  return (
    <div className={cn("flex aspect-[16/10] flex-col overflow-hidden rounded-[10px] border border-ink-line bg-ink", className)}>
      <div className="flex items-center gap-1.5 border-b border-ink-line px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
        <span className="ml-2 truncate font-mono text-[11px] text-dim">
          {project.liveLink ? project.liveLink.replace(/^https?:\/\/(www\.)?/, "") : `${project.slug}.dev`}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-center text-2xl font-bold text-fg/90">{project.title}</p>
      </div>
    </div>
  )
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-[20px] border border-ink-line bg-ink-card p-5 transition duration-300 hover:-translate-y-1 hover:border-brand/60">
      <div className="relative">
        <Link href={`/projects/${project.slug}`} aria-label={`View ${project.title}`} className="block overflow-hidden rounded-[10px]">
          <ProjectImage project={project} className="transition duration-500 group-hover:scale-[1.03]" />
        </Link>
        {project.liveLink && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} live site`}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-brand hover:text-brand-fg"
          >
            <Globe className="h-5 w-5" />
          </a>
        )}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-fg">{project.title}</h3>
      <p className="mt-2 flex-1 text-dim">{project.description}</p>
      {project.liveLink && (
        <a
          href={project.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 self-start text-sm font-medium text-brand hover:underline"
        >
          {displayUrl(project.liveLink)} <ExternalLink className="h-4 w-4" />
        </a>
      )}
      <Link href={`/projects/${project.slug}`} className="btn-primary mt-6 self-start">
        View Project <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  )
}
