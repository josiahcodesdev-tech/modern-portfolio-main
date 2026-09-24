import "server-only"
import { cache } from "react"
import { getSupabaseConfig } from "./supabase/config"
import { emptySnapshot, parsePublishedRow } from "./published-content"

// Deduplicate reads within a request without caching old publications.
export const getPublishedContent = cache(async () => {
  try {
    const config = getSupabaseConfig()
    if (!config) return emptySnapshot("Supabase is not configured yet.")
    const headers: Record<string, string> = { apikey: config.key }
    if (config.key.startsWith("eyJ")) headers.Authorization = `Bearer ${config.key}`
    const response = await fetch(`${config.url}/rest/v1/portfolio_content?id=eq.1&select=content,revision,updated_at`, {
      headers, cache: "no-store", signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error("Content request failed")
    const rows: unknown = await response.json()
    if (!Array.isArray(rows)) throw new Error("Invalid content response")
    return parsePublishedRow(rows[0])
  } catch {
    return emptySnapshot("Published content could not be loaded. Check the Supabase connection and database setup before publishing.")
  }
})
