// Personal details used across the whole site. Update these first.
export const site = {
  name: "Josiah Mwangi",
  shortName: "Josiah",
  role: "Web Developer",
  location: "Nairobi, Kenya",
  url: "https://josiahmwangi.vercel.app",
  description:
    "Josiah Mwangi is a web developer in Nairobi, Kenya, building fast, responsive websites and web applications.",

  // TODO: replace with real contact details
  email: "josiah.mwangi@email.com",
  // International format, digits only (used for wa.me links). Leave empty to hide WhatsApp.
  whatsapp: "254700000000",

  // Path to a file in /public, e.g. "/Josiah-Mwangi-Resume.pdf". Leave empty to hide the button.
  resume: "",
  // Path to a photo in /public
  photo: "/placeholder-user.jpg",

  // Leave a link empty to hide that icon
  socials: {
    github: "",
    linkedin: "",
  },
}

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
]

export const mailto = `mailto:${site.email}`

export function whatsappLink(text?: string) {
  if (!site.whatsapp) return ""
  const base = `https://wa.me/${site.whatsapp}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
