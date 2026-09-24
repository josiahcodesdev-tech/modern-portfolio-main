import { z } from "zod"
import { site } from "./site"
import { projects, skills, skillGroups, experience, education, quote, testimonials, openSource } from "./data"

const text = z.string().max(20000)
const required = text.trim().min(1, "This field is required")
const url = z.string().max(2000).refine((value) => {
  if (!value) return true
  try { return ["https:", "http:"].includes(new URL(value).protocol) } catch { return false }
}, "Use a full https:// or http:// URL")
const isLocalPath = (value: string) => /^\/(?!\/)/.test(value) && !/[\\\u0000-\u001f]/.test(value)
const asset = z.string().max(1500000).refine((value) => !value || isLocalPath(value) || url.safeParse(value).success || /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value), "Use an image URL, a /public-file path, or upload an image")
const lines = z.array(required).max(100)
export const projectSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
  title: required, description: required, fullDescription: required,
  tools: lines, deliverables: lines, liveLink: url.optional(), githubLink: url.optional(),
  image: asset.optional(), images: z.array(asset).max(20).optional(),
})
export const contentSchema = z.object({
  site: z.object({
    name: required, shortName: required, role: required, location: required,
    url: url.refine(Boolean, "Website URL is required"), description: required,
    email: z.string().email(), whatsapp: z.string().regex(/^\d{7,15}$|^$/, "Use 7–15 digits or leave blank"),
    resume: z.string().max(2000).refine(v => !v || isLocalPath(v) || url.safeParse(v).success, "Use a URL or /file path"),
    photo: asset.refine(Boolean, "A profile photo is required"), socials: z.object({ github: url, linkedin: url }),
  }),
  copy: z.object({ greeting: required, introduction: required, availability: text,
    aboutIntro: required, aboutBody: text, projectsIntro: text, skillsIntro: text,
    ctaTitle: required, ctaBody: text }),
  projects: z.array(projectSchema).max(100).superRefine((items, ctx) => {
    const used = new Set<string>()
    items.forEach((item, index) => {
      if (used.has(item.slug)) ctx.addIssue({ code: "custom", path: [index, "slug"], message: "Project URLs must be unique" })
      used.add(item.slug)
    })
  }),
  skills: lines,
  skillGroups: z.array(z.object({ icon: z.enum(["code", "server", "tools"]), title: required, description: text, skills: lines })).max(20),
  experience: z.array(z.object({ date: required, title: required, company: required, summary: text, highlights: lines })).max(50),
  education: z.array(z.object({ date: text, course: required, school: required })).max(50),
  quote: text,
  testimonials: z.array(z.object({ name: required, position: text, company: text, testimonial: required })).max(50),
  openSource: z.array(z.object({ project: required, description: text, points: lines, link: url.refine(Boolean), linkLabel: required })).max(50),
})
export type Content = z.infer<typeof contentSchema>
export const defaultContent: Content = {
  site, projects, skills, experience, education, quote, testimonials, openSource,
  skillGroups: skillGroups.map(({ icon: _, ...group }, index) => ({ ...group, icon: (["code", "server", "tools"] as const)[index] })),
  copy: {
    greeting: "Hello There!",
    introduction: `I'm ${site.name}, a passionate ${site.role} dedicated to building fast, responsive websites and web applications that help businesses grow online.`,
    availability: "Available for Freelancing",
    aboutIntro: "I build websites and web applications that are fast, responsive and user-focused. I enjoy turning ideas into polished products, solving problems and writing code that is clean and easy to maintain.",
    aboutBody: "I work well both independently and with teams, and I value clear communication and continuous growth. I care about delivering on time, on budget and to a standard my clients are proud to share.",
    projectsIntro: "A glimpse into what I've been building, driven by curiosity and a passion for creating practical web applications.",
    skillsIntro: "Technologies I've worked with to build scalable, user-friendly web applications",
    ctaTitle: "Are you ready to kickstart your project with a touch of magic?",
    ctaBody: "Reach out and let's make it happen. I'm also available for full-time or part-time opportunities where I can push the limits of code and deliver exceptional work.",
  },
}
export const STORAGE_KEY = "portfolio-content-v1"
export const backupSchema = z.object({ version: z.literal(1), content: contentSchema })
