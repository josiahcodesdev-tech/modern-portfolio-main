"use client"

import { Github, Linkedin, Mail } from "lucide-react"
import { useContent } from "@/components/content-provider"
import { cn } from "@/lib/utils"

export default function SocialLinks({ className }: { className?: string }) {
  const { content: { site } } = useContent()
  const mailto = `mailto:${site.email}`
  const links = [
    { href: site.socials.github, label: "GitHub", icon: Github },
    { href: site.socials.linkedin, label: "LinkedIn", icon: Linkedin },
  ].filter((l) => l.href)

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {links.map(({ href, label, icon: Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn">
          <Icon className="h-5 w-5" />
        </a>
      ))}
      <a href={mailto} aria-label="Send email" className="icon-btn">
        <Mail className="h-5 w-5" />
      </a>
    </div>
  )
}
