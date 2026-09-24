import { Code2, Server, Wrench, type LucideIcon } from "lucide-react"

// Scrolling skills strip on the home page
export const skills = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "HTML/CSS",
  "Tailwind CSS",
  "MongoDB",
  "PostgreSQL",
  "REST APIs",
  "Git",
  "GitHub",
  "Vercel",
  "Figma",
]

export type SkillGroup = {
  icon: LucideIcon
  title: string
  description: string
  skills: string[]
}

// TODO: adjust to match the technologies you actually use
export const skillGroups: SkillGroup[] = [
  {
    icon: Code2,
    title: "Frontend Development",
    description: "I build responsive, user-friendly interfaces that look great on every device and load fast.",
    skills: ["JavaScript", "TypeScript", "React.js", "Next.js", "HTML/CSS", "Tailwind CSS", "Responsive Design", "UI/UX Design"],
  },
  {
    icon: Server,
    title: "Backend Development",
    description: "I build reliable server-side logic and APIs that keep data organised and applications running smoothly.",
    skills: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "REST APIs", "Authentication (JWT)"],
  },
  {
    icon: Wrench,
    title: "Tools & Deployment",
    description: "I use modern tooling to ship quickly, keep code organised and get projects live with confidence.",
    skills: ["Version Control (Git)", "GitHub", "Vercel", "Figma", "SEO Optimization", "Performance Tuning", "CMS Integration"],
  },
]

export type Project = {
  slug: string
  title: string
  description: string
  fullDescription: string
  tools: string[]
  deliverables: string[]
  liveLink?: string
  githubLink?: string
  // Screenshot in /public, e.g. "/projects/gradelevate.jpg". With a liveLink, it shows until the live preview loads.
  image?: string
  // Extra screenshots shown on the project page
  images?: string[]
}

export const projects: Project[] = [
  {
    slug: "mycareercraft",
    title: "MyCareerCraft",
    description: "A career platform for professionals in Kenya with an ATS-ready CV builder, interview prep and coaching.",
    fullDescription:
      "MyCareerCraft helps professionals in Kenya and beyond land the jobs they want. Users build ATS-ready CVs in three steps, prepare for interviews with AI-personalised practice, and book career services such as CV writing, interview coaching and personal branding. The site also has a career advice blog.",
    // TODO: confirm the tech stack
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    liveLink: "https://www.mycareercraft.site/",
    image: "/projects/mycareercraft.jpg",
    deliverables: [
      "Built an ATS-ready CV builder: add details, shape the story, download a professional CV",
      "Created AI-personalised interview preparation",
      "Designed service pages for CV writing, interview coaching, proposal writing and personal branding",
      "Added a career advice blog, WhatsApp contact and analytics",
      "Optimised pages for search and fast loading on mobile",
    ],
  },
  {
    slug: "gradelevate",
    title: "GradElevate",
    description: "An academic success platform offering tutoring, dissertation support and career development services.",
    fullDescription:
      "GradElevate helps students succeed academically and professionally. I designed and built the website to present its tutoring, dissertation support and career development services clearly, and to turn visitors into enquiries.",
    // TODO: confirm the tech stack
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    liveLink: "https://www.gradelevate.co.uk",
    image: "/projects/gradelevate.jpg",
    deliverables: [
      "Designed and built a fully responsive website for desktop, tablet and mobile",
      "Created service pages for tutoring, dissertation support and career development",
      "Built the enquiry and contact flow to turn visitors into leads",
      "Applied on-page SEO best practices and optimised page performance",
    ],
  },
  {
    slug: "trendylocs",
    title: "TrendyLocs",
    description: "A modern e-commerce and brand website for a trendy hair and beauty business.",
    fullDescription:
      "TrendyLocs needed an online home that matched the energy of its brand. I built a modern e-commerce and brand website that showcases its hair and beauty offering and makes it easy for customers to browse, shop and get in touch.",
    // TODO: confirm the tech stack
    tools: ["React", "JavaScript", "Tailwind CSS"],
    liveLink: "https://www.trendylocs.com",
    image: "/projects/trendylocs.jpg",
    deliverables: [
      "Built a brand-led website design reflecting the business's style",
      "Implemented e-commerce product listings",
      "Delivered a mobile-first, responsive layout",
      "Optimised images and pages for fast loading and search visibility",
    ],
  },
  {
    slug: "vantage-africa",
    title: "Vantage Africa",
    description: "An internal lead generation and RFP tracking console for a corporate business development team.",
    fullDescription:
      "Vantage Africa is a private web app that helps a corporate business development team find, track and win tenders. The team logs leads and RFPs, moves them through a sales pipeline from first meeting to handover, shares tenders with the right teams, and sees firm-wide figures, all behind a secure, role-based login.",
    // TODO: confirm the tech stack
    tools: ["React", "Vite", "Supabase", "Tailwind CSS", "SheetJS", "Vercel"],
    liveLink: "https://pipeline-console-nine.vercel.app/",
    image: "/projects/vantage-africa.jpg",
    deliverables: [
      "Built secure sign-in with accounts issued by an administrator",
      "Designed role-based access: super users manage members and teams, admins see every pipeline and firm-wide figures",
      "Built a tender pipeline with stages from meeting request and proposal sent through to handover",
      "Added team-based sharing so each tender is visible to the right people",
      "Implemented a sync for tender listings and Excel export for reporting",
    ],
  },
]

// TODO: replace with your real work history
export const experience = [
  {
    date: "2020 - Present",
    title: "Freelance Web Developer",
    company: "Self-employed",
    summary: "Designing and building websites and web applications for startups, small businesses and organisations.",
    highlights: [
      "Built GradElevate, an academic success platform with tutoring, dissertation support and career services",
      "Built TrendyLocs, an e-commerce and brand website for a hair and beauty business",
      "Built MyCareerCraft, a career platform with an ATS-ready CV builder and interview prep",
      "Built Vantage Africa, a lead generation and RFP tracking console with role-based access",
      "Deliver responsive, SEO-friendly sites with clean code, on time and on budget",
    ],
  },
]

// TODO: replace with your real education
export const education = [
  {
    date: "Year - Year",
    course: "Your course or certificate",
    school: "Your school or institution",
  },
]

export const quote =
  "I build websites that look great, load fast and help businesses grow, with a focus on clean code and pixel-perfect design."

export const testimonials = [
  {
    name: "Sarah K.",
    position: "Startup Founder",
    company: "Nairobi",
    testimonial: "Josiah built our website in record time. Beautiful design, clean code, zero issues.",
  },
]

// Open source work, shown on the Projects page. Leave empty to hide the section.
export const openSource: {
  project: string
  description: string
  points: string[]
  link: string
  linkLabel: string
}[] = []
