import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublishedContent } from "@/lib/content-server"
import ProjectContent from "@/components/project-content"

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { content: { projects } } = await getPublishedContent()
  const project = projects.find(p => p.slug === slug)
  return { title: project?.title ?? "Project", description: project?.description }
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const { content: { projects }, error } = await getPublishedContent()
  if (!error && !projects.some(project => project.slug === slug)) notFound()
  return <ProjectContent slug={slug} />
}
