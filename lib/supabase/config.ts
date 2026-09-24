export type SupabaseConfig = { url: string; key: string }

// Browser code cannot read non-NEXT_PUBLIC_ variables, so the server passes the
// config down (see app/layout.tsx → ContentProvider) and it is stored here.
let clientConfig: SupabaseConfig | null = null
export function setClientSupabaseConfig(config: SupabaseConfig | null) {
  clientConfig = config
}

function first(...values: (string | undefined)[]) {
  return values.find((value) => value && value.trim())?.trim()
}

// Server-side lookup. Several names are accepted so the host can use
// non-public names (e.g. SUPABASE_URL) as well as the NEXT_PUBLIC_ ones.
function readEnv(): SupabaseConfig | null {
  const url = first(
    process.env.SUPABASE_URL,
    process.env.NEXT_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  )
  const key = first(
    process.env.SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
  return url && key ? { url, key } : null
}

// The key is sent to the browser, so only publishable/anon keys are allowed.
function validate(config: SupabaseConfig | null): SupabaseConfig | null {
  if (!config) return null
  const { key } = config
  if (key.startsWith("sb_secret_")) throw new Error("Use the publishable key, never a Supabase secret key.")
  if (key.startsWith("eyJ")) {
    try {
      const payload = JSON.parse(atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
      if (payload.role === "service_role") throw new Error("SERVICE_ROLE")
    } catch (error) {
      if (error instanceof Error && error.message === "SERVICE_ROLE") throw new Error("Use the anon key, never a service-role key.")
    }
  }
  return { url: config.url.replace(/\/$/, ""), key }
}

export function getSupabaseConfig(): SupabaseConfig | null {
  return validate(typeof window === "undefined" ? readEnv() : clientConfig)
}
