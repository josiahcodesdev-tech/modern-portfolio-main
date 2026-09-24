export type Field = {
  key: string
  label: string
  kind?: "long" | "list" | "image" | "select"
  options?: string[]
  hint?: string
  placeholder?: string
  // Fields with the same group are shown together under a small heading
  group?: string
}
export type Section = {
  key: string
  title: string
  description: string
  fields: Field[]
  collection?: boolean
  empty?: Record<string, unknown>
  // Singular name used on the "Add" button, e.g. "Add project"
  noun?: string
}

export const sections: Section[] = [
  { key: "projects", title: "Projects", noun: "project", description: "The first three appear on the home page.", collection: true,
    empty: { title: "", slug: "", description: "", fullDescription: "", tools: [], deliverables: [], image: "", images: [], liveLink: "", githubLink: "" },
    fields: [
      { key: "title", label: "Project name", group: "Basics" },
      { key: "slug", label: "Project URL", group: "Basics", hint: "Lowercase and hyphens, e.g. my-project → /projects/my-project" },
      { key: "description", label: "Short description", kind: "long", group: "Basics" },
      { key: "fullDescription", label: "Full case study", kind: "long", group: "Case study" },
      { key: "tools", label: "Tools and technologies", kind: "list", group: "Case study" },
      { key: "deliverables", label: "Deliverables", kind: "list", group: "Case study" },
      { key: "image", label: "Cover image", kind: "image", group: "Images" },
      { key: "images", label: "Extra screenshots", kind: "list", group: "Images", placeholder: "One image URL per line" },
      { key: "liveLink", label: "Live website", group: "Links", placeholder: "https://" },
      { key: "githubLink", label: "GitHub", group: "Links", placeholder: "https://github.com/…" },
    ] },
  { key: "openSource", title: "Open source", noun: "contribution", description: "Shown under your projects. Leave empty to hide.", collection: true,
    empty: { project: "", description: "", points: [], link: "", linkLabel: "View contribution" }, fields: [
      { key: "project", label: "Project name" }, { key: "linkLabel", label: "Button label" },
      { key: "description", label: "Description", kind: "long" }, { key: "points", label: "Contributions", kind: "list" },
      { key: "link", label: "Link", placeholder: "https://" },
    ] },
  { key: "site", title: "Profile & contact", description: "Your details, photo and contact links.", fields: [
    { key: "name", label: "Full name", group: "Identity" }, { key: "shortName", label: "Logo name", group: "Identity" },
    { key: "role", label: "Role", group: "Identity" }, { key: "location", label: "Location", group: "Identity" },
    { key: "photo", label: "Profile photo", kind: "image", group: "Identity" },
    { key: "description", label: "Site description", kind: "long", group: "Identity", hint: "Shown in search results." },
    { key: "email", label: "Email", group: "Contact" },
    { key: "whatsapp", label: "WhatsApp number", group: "Contact", placeholder: "254700000000", hint: "Digits only. Leave empty to hide." },
    { key: "resume", label: "Resume link", group: "Contact", placeholder: "https:// or /file.pdf" },
    { key: "url", label: "Website URL", group: "Contact", placeholder: "https://" },
    { key: "socials.github", label: "GitHub", group: "Social", placeholder: "https://github.com/…" },
    { key: "socials.linkedin", label: "LinkedIn", group: "Social", placeholder: "https://linkedin.com/in/…" },
  ] },
  { key: "copy", title: "Page text", description: "Headings and paragraphs across the site.", fields: [
    { key: "greeting", label: "Greeting", group: "Home" }, { key: "availability", label: "Availability", group: "Home" },
    { key: "introduction", label: "Introduction", kind: "long", group: "Home" },
    { key: "aboutIntro", label: "First paragraph", kind: "long", group: "About" },
    { key: "aboutBody", label: "Second paragraph", kind: "long", group: "About" },
    { key: "projectsIntro", label: "Projects intro", kind: "long", group: "Sections" },
    { key: "skillsIntro", label: "Skills intro", kind: "long", group: "Sections" },
    { key: "ctaTitle", label: "Heading", group: "Contact section" }, { key: "ctaBody", label: "Message", kind: "long", group: "Contact section" },
  ] },
  { key: "skills", title: "Skills strip", description: "The scrolling list on the home page.", fields: [{ key: "", label: "Skills", kind: "list" }] },
  { key: "skillGroups", title: "Skill groups", noun: "group", description: "The cards on the Skills page.", collection: true,
    empty: { icon: "code", title: "", description: "", skills: [] }, fields: [
      { key: "title", label: "Group name" }, { key: "icon", label: "Icon", kind: "select", options: ["code", "server", "tools"] },
      { key: "description", label: "Description", kind: "long" }, { key: "skills", label: "Skills", kind: "list" },
    ] },
  { key: "experience", title: "Experience", noun: "role", description: "Your work history.", collection: true,
    empty: { date: "", title: "", company: "", summary: "", highlights: [] }, fields: [
      { key: "title", label: "Job title" }, { key: "company", label: "Company" }, { key: "date", label: "Dates", placeholder: "2022 - Present" },
      { key: "summary", label: "Summary", kind: "long" }, { key: "highlights", label: "Highlights", kind: "list" },
    ] },
  { key: "education", title: "Education", noun: "qualification", description: "Courses and qualifications.", collection: true,
    empty: { date: "", course: "", school: "" }, fields: [
      { key: "course", label: "Course or qualification" }, { key: "school", label: "School" }, { key: "date", label: "Dates", placeholder: "2019 - 2023" },
    ] },
  { key: "quote", title: "Quote", description: "Shown beside your education.", fields: [{ key: "", label: "Quote", kind: "long" }] },
  { key: "testimonials", title: "Testimonials", noun: "testimonial", description: "Client feedback. Leave empty to hide.", collection: true,
    empty: { name: "", position: "", company: "", testimonial: "" }, fields: [
      { key: "name", label: "Client name" }, { key: "position", label: "Position" }, { key: "company", label: "Company" },
      { key: "testimonial", label: "Testimonial", kind: "long" },
    ] },
]

// Sidebar grouping
export const sectionGroups: { label: string; keys: string[] }[] = [
  { label: "Work", keys: ["projects", "openSource"] },
  { label: "Profile", keys: ["site", "copy"] },
  { label: "Skills", keys: ["skills", "skillGroups"] },
  { label: "About page", keys: ["experience", "education", "quote", "testimonials"] },
]
