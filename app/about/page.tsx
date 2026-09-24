import type { Metadata } from "next"
import { getPublishedContent } from "@/lib/content-server"
import AboutPage from "@/components/about-content"

export async function generateMetadata(): Promise<Metadata> {
  const { content: { site } } = await getPublishedContent()
  return {
  title: "About",
  description: `Get to know ${site.name}, a ${site.role.toLowerCase()} based in ${site.location}.`,
}

}

export default AboutPage
