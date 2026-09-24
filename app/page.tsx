import Image from "next/image"
import { Download } from "lucide-react"
import { skills } from "@/lib/data"
import { mailto, site } from "@/lib/site"
import Reveal from "@/components/reveal"
import SocialLinks from "@/components/social-links"
import ProjectsPanel from "@/components/projects-panel"
import CtaSection from "@/components/cta-section"

export default function HomePage() {
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
            <div className="panel p-6 md:p-10">
              <p className="text-dim">Hello There!</p>
              <p className="mt-4 text-2xl leading-snug text-fg md:text-3xl">
                I&apos;m {site.name}, a passionate {site.role} dedicated to building fast, responsive websites and web
                applications that help businesses grow online.
              </p>
              <p className="mt-6 flex items-center gap-2 text-dim">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
                </span>
                Available for Freelancing
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
              <h2 className="text-xl font-bold text-fg">Skills</h2>
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
