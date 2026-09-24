"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  ArrowDown, ArrowUp, ChevronDown, Download, ExternalLink, ImagePlus, LogOut, MoreHorizontal, Plus,
  RefreshCw, RotateCcw, Trash2, Undo2, Upload, X,
} from "lucide-react"
import { useContent } from "@/components/content-provider"
import { backupSchema, contentSchema, defaultContent, type Content } from "@/lib/content"
import { uploadImage } from "@/lib/content-browser"
import { sectionGroups, sections, type Field, type Section } from "@/lib/editor-fields"
import { cn } from "@/lib/utils"

type Path = (string | number)[]
function read(value: unknown, path: Path): unknown {
  return path.reduce<unknown>((current, key) => (current as Record<string, unknown>)?.[key], value)
}
function replace<T>(value: T, path: Path, next: unknown): T {
  if (!path.length) return next as T
  const [key, ...rest] = path
  const copy = Array.isArray(value) ? [...value] : { ...value }
  const object = copy as Record<string | number, unknown>
  object[key] = replace(object[key], rest, next)
  return copy as T
}
const inputClass =
  "w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-fg outline-none transition placeholder:text-dim/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
const iconButton =
  "flex h-8 w-8 items-center justify-center rounded-md text-dim transition hover:bg-ink-raised hover:text-fg disabled:pointer-events-none disabled:opacity-30"
const isImage = (value: string) => /^(https?:\/\/|\/(?!\/)|data:image\/)/.test(value)

function EditorField({ field, path, value, onChange, onUploadState }: {
  field: Field; path: Path; value: unknown; onChange: (value: unknown) => void; onUploadState: (busy: boolean) => void
}) {
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const id = `field-${path.join("-")}`
  const current = typeof value === "string" ? value : ""
  const wide = field.kind === "long" || field.kind === "list" || field.kind === "image"

  async function upload(file?: File) {
    if (!file) return
    setError("")
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) { setError("Choose a JPG, PNG, WebP or GIF image."); return }
    if (file.size > 5 * 1024 * 1024) { setError("Choose an image up to 5 MB."); return }
    setUploading(true); onUploadState(true)
    try { onChange(await uploadImage(file)) }
    catch (error) { setError(error instanceof Error ? error.message : "Image upload failed.") }
    finally { setUploading(false); onUploadState(false) }
  }

  const listValue = Array.isArray(value) ? value.join("\n") : ""
  return <div className={wide ? "md:col-span-2" : ""}>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">{field.label}</label>
    {field.kind === "image" ? (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-ink-line bg-ink">
          {current && isImage(current)
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={current} alt={`${field.label} preview`} className="h-full w-full object-cover" />
            : <ImagePlus className="h-6 w-6 text-dim/60" aria-hidden />}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input id={id} className={inputClass} value={current.startsWith("data:") ? "" : current}
            placeholder={current.startsWith("data:") ? "Uploaded image" : "Image URL or /path, or upload"} onChange={e => onChange(e.target.value)} />
          <div className="flex flex-wrap items-center gap-3">
            <label className="btn-outline cursor-pointer !px-3 !py-1.5 text-xs">
              <Upload className="h-3.5 w-3.5" />{uploading ? "Uploading…" : "Upload image"}
              <input type="file" className="sr-only" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading}
                onChange={e => { void upload(e.target.files?.[0]); e.target.value = "" }} />
            </label>
            {current && <button type="button" className="text-xs text-dim hover:text-fg" onClick={() => onChange("")}>Remove</button>}
            <span className="text-xs text-dim">JPG, PNG, WebP or GIF · max 5 MB</span>
          </div>
        </div>
      </div>
    ) : field.kind === "select" ? (
      <select id={id} className={inputClass} value={current} onChange={e => onChange(e.target.value)}>
        {field.options?.map(option => <option key={option}>{option}</option>)}
      </select>
    ) : field.kind === "long" || field.kind === "list" ? (
      <textarea id={id} className={inputClass}
        rows={field.kind === "list" ? Math.min(10, Math.max(3, listValue.split("\n").length + 1)) : 3}
        placeholder={field.placeholder ?? (field.kind === "list" ? "One per line" : undefined)}
        value={field.kind === "list" ? listValue : current}
        onChange={e => onChange(field.kind === "list" ? e.target.value.split("\n") : e.target.value)} />
    ) : (
      <input id={id} className={inputClass} placeholder={field.placeholder} value={current} onChange={e => onChange(e.target.value)} />
    )}
    {field.hint && <p className="mt-1.5 text-xs text-dim">{field.hint}</p>}
    {error && <p role="alert" className="mt-2 text-sm text-red-500">{error}</p>}
  </div>
}

// Title, subtitle and thumbnail for a collapsed list entry
function summarize(item: Record<string, unknown>) {
  const title = String(item.title || item.name || item.course || item.project || "Untitled")
  const subtitle = [item.company, item.school, item.position, item.date].filter(Boolean).join(" · ")
    || (typeof item.slug === "string" && item.slug ? `/projects/${item.slug}` : "")
    || (Array.isArray(item.skills) ? `${item.skills.length} skills` : "")
  const image = typeof item.image === "string" && isImage(item.image) ? item.image : ""
  return { title, subtitle, image }
}

function Menu({ items }: { items: ({ label: string; icon: typeof Download; onClick: () => void; danger?: boolean } | "divider" | string)[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !ref.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close); document.addEventListener("keydown", close)
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close) }
  }, [open])
  return <div ref={ref} className="relative">
    <button type="button" className="btn-outline !px-3" aria-label="More actions" aria-expanded={open} onClick={() => setOpen(v => !v)}>
      <MoreHorizontal className="h-4 w-4" />
    </button>
    {open && <div role="menu" className="absolute right-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-xl border border-ink-line bg-ink-card py-1.5 shadow-xl">
      {items.map((item, index) => item === "divider"
        ? <div key={index} className="my-1.5 border-t border-ink-line" />
        : typeof item === "string"
          ? <p key={index} className="truncate px-4 py-1.5 text-xs text-dim">{item}</p>
          : <button key={item.label} type="button" role="menuitem" onClick={() => { setOpen(false); item.onClick() }}
              className={cn("flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition hover:bg-ink-raised", item.danger ? "text-red-500" : "text-fg")}>
              <item.icon className="h-4 w-4 shrink-0" />{item.label}
            </button>)}
    </div>}
  </div>
}

export default function AdminEditor({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const { content, ready, storageError, revision, updatedAt, save, refresh } = useContent()
  const [baseRevision, setBaseRevision] = useState(revision)
  const [saving, setSaving] = useState(false)
  const [uploads, setUploads] = useState(0)
  const savingRef = useRef(false)
  const [draft, setDraft] = useState<Content>(content)
  const [dirty, setDirty] = useState(false)
  const [externalChange, setExternalChange] = useState(false)
  const [active, setActive] = useState("projects")
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const importInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (savingRef.current) return
    if (dirty) setExternalChange(true)
    else { setDraft(content); setBaseRevision(revision) }
    // Only react to saved content changes, not each keystroke in the draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, revision])
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = "" }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  const section = sections.find(item => item.key === active)!
  const value = read(draft, [active])

  function change(path: Path, next: unknown) {
    setDraft(previous => replace(previous, path, next))
    setDirty(true); setMessage(""); setErrors([])
  }
  function toggle(key: string, open?: boolean) {
    setExpanded(previous => {
      const next = new Set(previous)
      if (open ?? !next.has(key)) next.add(key); else next.delete(key)
      return next
    })
  }

  async function saveChanges() {
    if (externalChange) { setErrors(["A newer version was published elsewhere. Export your draft, then reload before publishing."]); return }
    // Blank lines are separators in list inputs, not content items.
    const clean = (item: unknown): unknown => Array.isArray(item) ? item.filter(x => typeof x !== "string" || x.trim()).map(clean)
      : item && typeof item === "object" ? Object.fromEntries(Object.entries(item).map(([key, val]) => [key, clean(val)])) : item
    const parsed = contentSchema.safeParse(clean(draft))
    if (!parsed.success) {
      const labelFor = (path: PropertyKey[]) => {
        const owner = sections.find(s => s.key === path[0])
        const fieldKey = path.slice(owner?.collection ? 2 : 1).join(".")
        const field = owner?.fields.find(f => f.key === fieldKey)
        const entry = owner?.collection && typeof path[1] === "number" ? ` ${path[1] + 1}` : ""
        return `${owner?.title ?? String(path[0])}${entry}${field ? ` → ${field.label}` : ""}`
      }
      setErrors(parsed.error.issues.map(issue => `${labelFor(issue.path)}: ${issue.message}`))
      const [first] = parsed.error.issues
      setActive(String(first.path[0]))
      if (typeof first.path[1] === "number") toggle(`${String(first.path[0])}-${first.path[1]}`, true)
      setMessage(""); return
    }
    setSaving(true); savingRef.current = true
    try {
      const published = await save(parsed.data, baseRevision)
      setDraft(published.content); setBaseRevision(published.revision); setDirty(false); setExternalChange(false); setErrors([])
      setMessage("Published. Your site is updated.")
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Publishing failed. Your draft has been kept."])
    } finally { setSaving(false); savingRef.current = false }
  }
  async function reloadPublished() {
    if (dirty && !window.confirm("Discard your draft and reload the published version?")) return
    setSaving(true); savingRef.current = true
    try {
      const latest = await refresh()
      if (latest) { setDraft(latest.content); setBaseRevision(latest.revision); setDirty(false); setExternalChange(false); setErrors([]); setMessage("Loaded the latest published version.") }
    } finally { setSaving(false); savingRef.current = false }
  }
  function discardDraft() {
    if (!window.confirm("Discard all unpublished changes?")) return
    setDraft(content); setBaseRevision(revision); setDirty(false); setErrors([]); setExternalChange(false); setMessage("Changes discarded.")
  }
  function restoreOriginal() {
    if (!window.confirm("Replace your draft with the original portfolio content? Nothing changes on the live site until you publish.")) return
    setDraft(structuredClone(defaultContent)); setDirty(true); setErrors([]); setMessage("Original content loaded. Publish to apply it.")
  }
  function exportBackup() {
    if (!contentSchema.safeParse(draft).success) { setErrors(["Fix the highlighted fields before exporting a backup."]); return }
    const blob = new Blob([JSON.stringify({ version: 1, content: draft }, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage("Backup downloaded.")
  }
  async function importBackup(file?: File) {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setErrors(["The backup is too large (maximum 10 MB)."]); return }
    try {
      const parsed = backupSchema.safeParse(JSON.parse(await file.text()))
      if (!parsed.success) { setErrors(["This file is not a valid portfolio backup."]); return }
      if (!window.confirm("Replace your draft with this backup? Nothing changes on the live site until you publish.")) return
      setDraft(parsed.data.content); setDirty(true); setErrors([]); setMessage("Backup loaded. Review it, then publish.")
    } catch { setErrors(["Could not read the backup. Choose a portfolio JSON file."]) }
  }
  function move(index: number, offset: number) {
    const items = [...value as unknown[]]
    ;[items[index], items[index + offset]] = [items[index + offset], items[index]]
    change([active], items)
    const a = `${active}-${index}`, b = `${active}-${index + offset}`
    setExpanded(previous => {
      const next = new Set(previous)
      const hadA = next.has(a), hadB = next.has(b)
      next.delete(a); next.delete(b)
      if (hadA) next.add(b)
      if (hadB) next.add(a)
      return next
    })
  }
  function addEntry() {
    const items = value as unknown[]
    change([active], [...items, structuredClone(section.empty)])
    toggle(`${active}-${items.length}`, true)
    setTimeout(() => document.getElementById(`entry-${active}-${items.length}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
  }
  function removeEntry(index: number) {
    const items = value as unknown[]
    if (!window.confirm(`Remove "${summarize(items[index] as Record<string, unknown>).title}"?`)) return
    change([active], items.filter((_, i) => i !== index))
    setExpanded(new Set())
  }

  function fields(owner: Section, base: Path, item: unknown) {
    const groups: { name?: string; fields: Field[] }[] = []
    for (const field of owner.fields) {
      const last = groups[groups.length - 1]
      if (last && last.name === field.group) last.fields.push(field)
      else groups.push({ name: field.group, fields: [field] })
    }
    return <div className="space-y-8">{groups.map(group => <div key={group.name ?? "fields"}>
      {group.name && <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-dim">{group.name}</h3>}
      <div className="grid gap-5 md:grid-cols-2">{group.fields.map(field => {
        const keys = field.key ? field.key.split(".") : []
        const path = [...base, ...keys]
        return <EditorField key={path.join(".")} field={field} path={path} value={read(item, keys)}
          onChange={next => change(path, next)} onUploadState={busy => setUploads(count => count + (busy ? 1 : -1))} />
      })}</div>
    </div>)}</div>
  }

  if (!ready) return <section className="container"><div className="panel p-10" aria-busy="true">Loading…</div></section>

  const status = dirty
    ? { dot: "bg-amber-500", text: "Unpublished changes" }
    : { dot: "bg-emerald-500", text: updatedAt ? `Published ${new Date(updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}` : "Up to date" }

  return <section className="container pb-16"><fieldset disabled={saving || uploads > 0} className="min-w-0">
    {/* Toolbar */}
    <div className="panel sticky top-20 z-30 mb-6 flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:top-24 md:px-6">
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-fg md:text-xl">Content studio</h1>
        <p className="mt-0.5 flex items-center gap-2 text-xs text-dim" role="status">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", status.dot)} aria-hidden />{saving ? "Publishing…" : uploads > 0 ? "Uploading image…" : status.text}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/" target="_blank" className="btn-outline hidden !px-4 sm:inline-flex">View site <ExternalLink className="h-4 w-4" /></Link>
        <button type="button" className="btn-primary !px-5 disabled:opacity-50"
          disabled={(!dirty && revision > 0) || Boolean(storageError) || externalChange} onClick={() => void saveChanges()}>
          Publish changes
        </button>
        <Menu items={[
          { label: "Export backup", icon: Download, onClick: exportBackup },
          { label: "Import backup", icon: Upload, onClick: () => importInput.current?.click() },
          "divider",
          { label: "Reload published version", icon: RefreshCw, onClick: () => void reloadPublished() },
          ...(dirty ? [{ label: "Discard changes", icon: Undo2, onClick: discardDraft }] : []),
          { label: "Restore original content", icon: RotateCcw, onClick: restoreOriginal },
          "divider",
          email,
          { label: "Sign out", icon: LogOut, onClick: onSignOut, danger: true },
        ]} />
        <input ref={importInput} type="file" accept="application/json,.json" className="hidden" aria-label="Import portfolio backup"
          onChange={e => { void importBackup(e.target.files?.[0]); e.target.value = "" }} />
      </div>
    </div>

    {/* Notices */}
    {storageError && <p role="alert" className="mb-4 rounded-lg border border-red-500/40 bg-red-500/5 p-4 text-sm text-fg">{storageError}</p>}
    {externalChange && <p role="alert" className="mb-4 rounded-lg border border-amber-500/50 bg-amber-500/5 p-4 text-sm text-fg">
      A newer version was published elsewhere. Export your draft if needed, then choose <strong>Reload published version</strong> from the ⋯ menu.
    </p>}
    {message && <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-brand/40 bg-brand/5 px-4 py-3 text-sm text-fg">
      {message}<button type="button" aria-label="Dismiss" className={iconButton} onClick={() => setMessage("")}><X className="h-4 w-4" /></button>
    </div>}
    {errors.length > 0 && <div role="alert" className="mb-4 rounded-lg border border-red-500/50 bg-red-500/5 p-4 text-sm text-fg">
      <p className="font-semibold">Please fix before publishing</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">{errors.map((error, index) => <li key={index}>{error}</li>)}</ul>
    </div>}

    <div className="grid items-start gap-6 lg:grid-cols-[230px_1fr]">
      {/* Sections */}
      <nav aria-label="Content sections" className="panel flex gap-4 overflow-x-auto p-3 lg:sticky lg:top-48 lg:flex-col lg:gap-5">
        {sectionGroups.map(group => <div key={group.label} className="flex shrink-0 gap-1 lg:flex-col">
          <p className="hidden px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-dim lg:block">{group.label}</p>
          {group.keys.map(key => {
            const item = sections.find(s => s.key === key)!
            const count = item.collection ? (read(draft, [key]) as unknown[]).length : null
            return <button type="button" key={key} aria-current={active === key ? "page" : undefined} onClick={() => setActive(key)}
              className={cn("flex items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition",
                active === key ? "bg-brand text-brand-fg" : "text-soft hover:bg-ink-raised")}>
              {item.title}
              {count !== null && <span className={cn("text-xs", active === key ? "opacity-80" : "text-dim")}>{count}</span>}
            </button>
          })}
        </div>)}
      </nav>

      {/* Editor */}
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-fg">{section.title}</h2>
            <p className="mt-1 text-sm text-dim">{section.description}</p>
          </div>
          {section.collection && <button type="button" className="btn-primary" onClick={addEntry}>
            <Plus className="h-4 w-4" />Add {section.noun ?? "entry"}
          </button>}
        </div>

        {section.collection ? <div className="space-y-3">
          {(value as Record<string, unknown>[]).length === 0 && <div className="panel border-dashed p-10 text-center text-sm text-dim">Nothing here yet.</div>}
          {(value as Record<string, unknown>[]).map((item, index, items) => {
            const key = `${active}-${index}`
            const open = expanded.has(key)
            const { title, subtitle, image } = summarize(item)
            return <div key={key} id={`entry-${key}`} className="panel scroll-mt-48 overflow-hidden">
              <div className="flex items-center gap-3 p-3 pr-2 md:gap-4 md:p-4">
                <button type="button" onClick={() => toggle(key)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-3 text-left md:gap-4">
                  {active === "projects" && <span className="hidden h-12 w-20 shrink-0 overflow-hidden rounded-md border border-ink-line bg-ink sm:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {image && <img src={image} alt="" className="h-full w-full object-cover object-top" />}
                  </span>}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-fg">{title}</span>
                    {subtitle && <span className="block truncate text-xs text-dim">{subtitle}</span>}
                  </span>
                </button>
                <div className="flex shrink-0 items-center">
                  <button type="button" className={iconButton} disabled={index === 0} aria-label={`Move entry ${index + 1} up`} onClick={() => move(index, -1)}><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" className={iconButton} disabled={index === items.length - 1} aria-label={`Move entry ${index + 1} down`} onClick={() => move(index, 1)}><ArrowDown className="h-4 w-4" /></button>
                  <button type="button" className={cn(iconButton, "hover:text-red-500")} aria-label={`Remove entry ${index + 1}`} onClick={() => removeEntry(index)}><Trash2 className="h-4 w-4" /></button>
                  <button type="button" className={iconButton} aria-label={open ? "Collapse" : "Edit"} onClick={() => toggle(key)}>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                  </button>
                </div>
              </div>
              {open && <div className="border-t border-ink-line p-5 md:p-6">{fields(section, [active, index], item)}</div>}
            </div>
          })}
        </div> : <div className="panel p-5 md:p-8">{fields(section, [active], value)}</div>}
      </div>
    </div>
  </fieldset></section>
}
