"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { LockKeyhole } from "lucide-react"
import { getSupabaseConfig } from "@/lib/supabase/config"
import { getSupabaseBrowser } from "@/lib/supabase/browser"
import { useContent } from "./content-provider"
import AdminEditor from "./admin-editor"

export default function AdminAccess() {
  const [status, setStatus] = useState<"loading" | "setup" | "login" | "denied" | "admin">("loading")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const { refresh } = useContent()

  useEffect(() => {
    let active = true
    let generation = 0
    let timer: ReturnType<typeof setTimeout>
    try {
      if (!getSupabaseConfig()) { setStatus("setup"); return }
      const client = getSupabaseBrowser()
      const check = async () => {
        const run = ++generation
        try {
          const { data: { user } } = await client.auth.getUser()
          if (!active || run !== generation) return
          if (!user) { setStatus("login"); return }
          setEmail(user.email ?? "")
          const { data, error } = await client.from("portfolio_admins").select("user_id").eq("user_id", user.id).maybeSingle()
          if (!active || run !== generation) return
          setStatus(data && !error ? "admin" : "denied")
          if (error) setMessage("Admin access could not be checked. Make sure supabase/setup.sql has been run.")
          else if (!data) setMessage("This account is not on the admin list.")
          else { setMessage(""); void refresh() }
        } catch {
          if (active && run === generation) { setStatus("login"); setMessage("Could not connect to Supabase. Please try again.") }
        }
      }
      void check()
      const { data: { subscription } } = client.auth.onAuthStateChange(() => {
        // Run outside the auth callback so getUser does not contend for its lock.
        clearTimeout(timer)
        timer = setTimeout(() => { void check() }, 0)
      })
      return () => { active = false; clearTimeout(timer); subscription.unsubscribe() }
    } catch (error) {
      setStatus("setup"); setMessage(error instanceof Error ? error.message : "Check the Supabase configuration.")
    }
  }, [refresh])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("")
    try {
      const { error } = await getSupabaseBrowser().auth.signInWithPassword({ email: email.trim(), password })
      if (error) setMessage("Incorrect email or password.")
      else setPassword("")
    } catch { setMessage("Could not connect. Check your connection and try again.") }
    finally { setBusy(false) }
  }
  const signOut = useCallback(async () => {
    setBusy(true)
    try {
      const { error } = await getSupabaseBrowser().auth.signOut({ scope: "local" })
      if (error) throw error
      setStatus("login"); setPassword(""); setMessage("")
    } catch { setMessage("Sign-out failed. Please try again.") }
    finally { setBusy(false) }
  }, [])

  const card = "panel mx-auto w-full max-w-md p-8"
  if (status === "loading") return <section className="container"><div className={card} aria-busy="true"><p className="text-dim">Loading…</p></div></section>
  if (status === "setup") return <section className="container"><div className={card}>
    <LockKeyhole className="mb-4 h-8 w-8 text-brand" /><h1 className="text-2xl font-bold text-fg">Connect Supabase</h1>
    <p className="mt-3 text-sm text-dim">Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in .env.local (and in Vercel for the live site), then restart or redeploy.</p>
    {message && <p role="alert" className="mt-4 text-sm text-red-500">{message}</p>}
  </div></section>
  if (status === "admin") return <AdminEditor email={email} onSignOut={() => { if (window.confirm("Sign out? Unpublished changes will be lost.")) void signOut() }} />
  if (status === "denied") return <section className="container"><div className={card}>
    <h1 className="text-2xl font-bold text-fg">No admin access</h1>
    <p role="alert" className="mt-3 text-sm text-dim">{message}</p>
    <button type="button" onClick={() => void signOut()} disabled={busy} className="btn-primary mt-6 w-full">Sign out</button>
  </div></section>
  return <section className="container"><form onSubmit={signIn} className={card}>
    <LockKeyhole className="mb-4 h-8 w-8 text-brand" /><h1 className="text-2xl font-bold text-fg">Admin sign in</h1>
    <label className="mt-6 block text-sm font-medium text-fg" htmlFor="admin-email">Email</label>
    <input id="admin-email" type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-ink-line bg-ink px-3 py-3 text-fg outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
    <label className="mt-4 block text-sm font-medium text-fg" htmlFor="admin-password">Password</label>
    <input id="admin-password" type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-ink-line bg-ink px-3 py-3 text-fg outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
    {message && <p role="alert" className="mt-4 text-sm text-red-500">{message}</p>}
    <button type="submit" disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
  </form></section>
}
