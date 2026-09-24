import type { MetadataRoute } from "next"
import { getPublishedContent } from "@/lib/content-server"
import { nav, site } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { content: { projects }, updatedAt } = await getPublishedContent()
  const lastModified = updatedAt ? new Date(updatedAt) : new Date()

  const pages = nav.map(({ href }) => ({
    url: new URL(href, site.url).toString(),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: href === "/" ? 1 : 0.8,
  }))
  const projectPages = projects.map(project => ({
    url: new URL(`/projects/${project.slug}`, site.url).toString(),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))
  return [...pages, ...projectPages]
}
