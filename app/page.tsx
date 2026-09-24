"use client"

import Image from "next/image"
import { Download } from "lucide-react"
import { useContent } from "@/components/content-provider"
import Reveal from "@/components/reveal"
import SocialLinks from "@/components/social-links"
import ProjectsPanel from "@/components/projects-panel"
import CtaSection from "@/components/cta-section"

export default function HomePage() {
  const { content: { site, skills, copy } } = useContent()
  const mailto = `mailto:${site.email}`
  return (
    <>
      <section className="container">
        <Reveal className="flex flex-col gap-8 md:flex-row">
          {/* Profile card */}
          <div className="panel flex-1 p-6 text-center md:p-10">
            <div className="relative mx-auto mt-4 h-[250px] w-[250px] overflow-hidden rounded-full md:h-[300px] md:w-[300px]">
              <Image src={site.photo} alt={site.name} fill priority className="object-cover" />
            </div>
            <h1 className="mt-9 text-2xl font-bold text-fg">{site.name}</h1>
            <p className="mt-2.5 text-dim">
              I am a {site.role} based in {site.location}
            </p>
            <SocialLinks className="mt-5 justify-center" />
          </div>

          <div className="flex flex-[2] flex-col gap-8 overflow-hidden">
            {/* Intro card */}
            <div className="panel p-6 md:p-10 light:border-navy light:bg-navy light:bg-gradient-to-br light:from-navy light:to-[#1b2d44]">
              <p className="text-dim light:eyebrow">{copy.greeting}</p>
              <p className="mt-4 text-2xl leading-snug text-fg md:text-3xl light:font-semibold light:text-white">
                {copy.introduction}
              </p>
              <p className="mt-6 flex items-center gap-2 text-dim light:text-white/75">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
                </span>
                {copy.availability}
              </p>
              {site.resume ? (
                <a href={site.resume} download className="btn-primary mt-9">
                  Download Resume <Download className="h-4 w-4" />
                </a>
              ) : (
                <a href={mailto} className="btn-primary mt-9">
                  Hire me
                </a>
              )}
            </div>

            {/* Skills strip */}
            <div className="panel p-6 md:p-10">
              <p className="eyebrow hidden light:block">What I work with</p>
              <h2 className="text-xl font-bold text-fg light:mt-2">Skills</h2>
              <div className="marquee-wrap mt-9 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <ul className="marquee flex w-max gap-5">
                  {[...skills, ...skills].map((skill, i) => (
                    <li key={i} className="pill" aria-hidden={i >= skills.length}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <ProjectsPanel limit={3} />
      <CtaSection />
    </>
  )
}
