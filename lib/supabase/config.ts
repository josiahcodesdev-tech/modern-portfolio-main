export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  if (key.startsWith("sb_secret_")) throw new Error("Use the publishable key, never a Supabase secret key.")
  if (key.startsWith("eyJ")) {
    try {
      const payload = JSON.parse(atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
      if (payload.role === "service_role") throw new Error("SERVICE_ROLE")
    } catch (error) {
      if (error instanceof Error && error.message === "SERVICE_ROLE") throw new Error("Use the anon key, never a service-role key.")
    }
  }
  return { url, key }
}
