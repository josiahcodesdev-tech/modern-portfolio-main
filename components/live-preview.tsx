"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// The site renders at desktop size inside the iframe, then gets scaled down to fit the container.
const FRAME_WIDTH = 1280
const FRAME_HEIGHT = 800

export default function LivePreview({
  url,
  title,
  poster,
  interactive = false,
  className,
}: {
  url: string
  title: string
  // Screenshot shown instantly; the live site fades in over it once fully loaded.
  poster?: string
  interactive?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / FRAME_WIDTH))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn("relative aspect-[16/10] overflow-hidden rounded-[10px] bg-ink", className)}>
      {poster ? (
        <Image src={poster} alt={`${title} screenshot`} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover object-top" />
      ) : (
        // Spinner sits behind the iframe and is covered as soon as the site paints.
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink-line border-t-brand" aria-hidden />
        </div>
      )}
      {scale > 0 && (
        <iframe
          src={url}
          title={`${title} live preview`}
          loading="lazy"
          scrolling={interactive ? "yes" : "no"}
          tabIndex={interactive ? undefined : -1}
          aria-hidden={interactive ? undefined : true}
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-700",
            !interactive && "pointer-events-none",
            poster && !loaded && "opacity-0",
          )}
          style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT, transform: `scale(${scale})` }}
        />
      )}
    </div>
  )
}
