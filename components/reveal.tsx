"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

// Fades content up into view. The server-rendered HTML is always visible (a CSS entrance
// animation plays without JavaScript); once hydrated, sections below the fold are hidden
// and revealed as they scroll into view.
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<"initial" | "hidden" | "shown">("initial")

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    setState("hidden")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown")
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -40px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}s`, transitionDelay: state === "shown" ? `${delay}s` : undefined }}
      className={cn(
        state === "initial" && "reveal-enter",
        state !== "initial" && "transition-[opacity,transform] duration-700 ease-out",
        state === "hidden" && "translate-y-[60px] opacity-0",
        className,
      )}
    >
      {children}
    </div>
  )
}
