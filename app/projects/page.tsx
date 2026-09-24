import type { Metadata } from "next"
import { getPublishedContent } from "@/lib/content-server"
import ProjectsPage from "@/components/projects-content"

export async function generateMetadata(): Promise<Metadata> {
  const { content: { site } } = await getPublishedContent()
  return {
  title: "Projects",
  description: `Websites and web applications built by ${site.name}.`,
}

}

export default ProjectsPage
