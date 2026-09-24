"use client"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseConfig } from "./config"

let client: SupabaseClient | undefined
export function getSupabaseBrowser() {
  if (client) return client
  const config = getSupabaseConfig()
  if (!config) throw new Error("Supabase is not configured. Follow the setup steps in README.md.")
  client = createClient(config.url, config.key)
  return client
}
