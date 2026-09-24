export type Field = { key: string; label: string; kind?: "long" | "list" | "image" | "select"; options?: string[]; hint?: string }
export type Section = { key: string; title: string; description: string; fields: Field[]; collection?: boolean; empty?: Record<string, unknown> }
export const sections: Section[] = [
  { key: "projects", title: "Projects", description: "Add your work, edit case studies, and set the order. The first three projects appear on Home.", collection: true,
    empty: { title: "", slug: "", description: "", fullDescription: "", tools: [], deliverables: [], image: "", images: [], liveLink: "", githubLink: "" },
    fields: [
      { key: "title", label: "Project name" }, { key: "slug", label: "Project URL", hint: "Unique lowercase name, e.g. my-new-project. Changing this changes its link." },
      { key: "description", label: "Short description", kind: "long" }, { key: "fullDescription", label: "Full case study", kind: "long" },
      { key: "image", label: "Cover image", kind: "image" }, { key: "images", label: "Extra screenshot URLs", kind: "list", hint: "One image URL or /file path per line." },
      { key: "liveLink", label: "Live website URL" }, { key: "githubLink", label: "GitHub URL" },
      { key: "tools", label: "Tools and technologies", kind: "list" }, { key: "deliverables", label: "Deliverables", kind: "list" },
    ] },
  { key: "site", title: "Profile & contact", description: "Your personal details, photo, contact links, and social accounts.", fields: [
    { key: "name", label: "Full name" }, { key: "shortName", label: "Logo name" }, { key: "role", label: "Role" }, { key: "location", label: "Location" },
    { key: "photo", label: "Profile photo", kind: "image" }, { key: "description", label: "Site description", kind: "long" },
    { key: "email", label: "Email" }, { key: "whatsapp", label: "WhatsApp number", hint: "Country code and digits only; leave blank to hide." },
    { key: "url", label: "Website URL" }, { key: "resume", label: "Resume URL or /file path" },
    { key: "socials.github", label: "GitHub URL" }, { key: "socials.linkedin", label: "LinkedIn URL" },
  ] },
  { key: "copy", title: "Page text", description: "Edit your introduction, biography, section descriptions, and contact message.", fields: [
    { key: "greeting", label: "Home greeting" }, { key: "availability", label: "Availability message" },
    { key: "introduction", label: "Home introduction", kind: "long" }, { key: "aboutIntro", label: "About — first paragraph", kind: "long" },
    { key: "aboutBody", label: "About — second paragraph", kind: "long" }, { key: "projectsIntro", label: "Projects introduction", kind: "long" },
    { key: "skillsIntro", label: "Skills introduction", kind: "long" }, { key: "ctaTitle", label: "Contact heading" }, { key: "ctaBody", label: "Contact description", kind: "long" },
  ] },
  { key: "skills", title: "Skills strip", description: "Technologies in the scrolling strip on your home page.", fields: [{ key: "", label: "Skills", kind: "list" }] },
  { key: "skillGroups", title: "Skill groups", description: "Organize the skills shown on the Skills page.", collection: true, empty: { icon: "code", title: "", description: "", skills: [] }, fields: [
    { key: "title", label: "Group name" }, { key: "icon", label: "Icon", kind: "select", options: ["code", "server", "tools"] },
    { key: "description", label: "Description", kind: "long" }, { key: "skills", label: "Skills", kind: "list" },
  ] },
  { key: "experience", title: "Experience", description: "Your work history and achievements.", collection: true, empty: { date: "", title: "", company: "", summary: "", highlights: [] }, fields: [
    { key: "title", label: "Job title" }, { key: "company", label: "Company" }, { key: "date", label: "Dates" },
    { key: "summary", label: "Summary", kind: "long" }, { key: "highlights", label: "Highlights", kind: "list" },
  ] },
  { key: "education", title: "Education", description: "Qualifications and courses. Remove placeholder entries if you don't need them.", collection: true, empty: { date: "", course: "", school: "" }, fields: [
    { key: "course", label: "Course or qualification" }, { key: "school", label: "School or institution" }, { key: "date", label: "Dates" },
  ] },
  { key: "quote", title: "Personal quote", description: "The quote beside your education on the About page.", fields: [{ key: "", label: "Quote", kind: "long" }] },
  { key: "testimonials", title: "Testimonials", description: "Feedback from your clients. An empty list hides this section.", collection: true, empty: { name: "", position: "", company: "", testimonial: "" }, fields: [
    { key: "name", label: "Client name" }, { key: "position", label: "Position" }, { key: "company", label: "Company" }, { key: "testimonial", label: "Testimonial", kind: "long" },
  ] },
  { key: "openSource", title: "Open source", description: "Contributions shown below your projects. An empty list hides this section.", collection: true, empty: { project: "", description: "", points: [], link: "", linkLabel: "View contribution" }, fields: [
    { key: "project", label: "Project name" }, { key: "description", label: "Description", kind: "long" }, { key: "points", label: "Contributions", kind: "list" },
    { key: "link", label: "Contribution URL" }, { key: "linkLabel", label: "Link label" },
  ] },
]
