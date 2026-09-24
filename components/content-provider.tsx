"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { fetchPublishedContent, publishContent } from "@/lib/content-browser"
import { getSupabaseConfig } from "@/lib/supabase/config"
import type { Content } from "@/lib/content"
import type { ContentSnapshot } from "@/lib/published-content"

type ContentContext = {
  content: Content; ready: boolean; storageError: string; revision: number; updatedAt: string | null
  refresh: () => Promise<ContentSnapshot | null>
  save: (content: Content, revision: number) => Promise<ContentSnapshot>
}
const Context = createContext<ContentContext | null>(null)

export function ContentProvider({ children, initial }: { children: ReactNode; initial: ContentSnapshot }) {
  const [snapshot, setSnapshot] = useState(initial)
  const apply = useCallback((next: ContentSnapshot) => {
    setSnapshot(previous => next.revision > previous.revision ? next : { ...previous, error: next.error })
  }, [])
  const refresh = useCallback(async () => {
    try { const next = await fetchPublishedContent(); apply(next); return next }
    catch (error) { setSnapshot(previous => ({ ...previous, error: error instanceof Error ? error.message : "Unable to load content." })); return null }
  }, [apply])
  useEffect(() => { apply(initial) }, [initial, apply])
  useEffect(() => {
    let configured = false
    try { configured = Boolean(getSupabaseConfig()) } catch { /* Admin setup explains configuration errors. */ }
    if (!configured) return
    void refresh()
    const onFocus = () => { if (document.visibilityState === "visible") void refresh() }
    window.addEventListener("focus", onFocus)
    const interval = window.setInterval(onFocus, 60000)
    return () => { window.removeEventListener("focus", onFocus); window.clearInterval(interval) }
  }, [refresh])
  async function save(content: Content, revision: number) {
    const next = await publishContent(content, revision)
    apply(next)
    return next
  }
  return <Context.Provider value={{ content: snapshot.content, ready: true, storageError: snapshot.error, revision: snapshot.revision, updatedAt: snapshot.updatedAt, refresh, save }}>{children}</Context.Provider>
}

export function useContent() {
  const context = useContext(Context)
  if (!context) throw new Error("ContentProvider is required")
  return context
}
