"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowUp, Download, ExternalLink, ImagePlus, Plus, Save, Trash2, Upload } from "lucide-react"
import { useContent } from "@/components/content-provider"
import { backupSchema, contentSchema, defaultContent, STORAGE_KEY, type Content } from "@/lib/content"
import { uploadImage } from "@/lib/content-browser"
import { sections, type Field } from "@/lib/editor-fields"

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
const inputClass = "w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-fg outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"

function EditorField({ field, path, value, onChange, onUploadState }: { field: Field; path: Path; value: unknown; onChange: (value: unknown) => void; onUploadState: (busy: boolean) => void }) {
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const id = `field-${path.join("-")}`
  const current = typeof value === "string" ? value : ""
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

  return <div className={field.kind === "long" || field.kind === "list" || field.kind === "image" ? "md:col-span-2" : ""}>
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg">{field.label}</label>
    {field.kind === "select" ? <select id={id} className={inputClass} value={current} onChange={e => onChange(e.target.value)}>{field.options?.map(option => <option key={option}>{option}</option>)}</select>
      : field.kind === "long" || field.kind === "list" ? <textarea id={id} className={inputClass} rows={4} value={field.kind === "list" ? (Array.isArray(value) ? value.join("\n") : "") : current} onChange={e => onChange(field.kind === "list" ? e.target.value.split("\n") : e.target.value)} />
      : <input id={id} className={inputClass} value={field.kind === "image" && current.startsWith("data:") ? "" : current} placeholder={field.kind === "image" && current.startsWith("data:") ? "Uploaded image — paste a URL to replace it" : undefined} onChange={e => onChange(e.target.value)} />}
    {(field.hint || field.kind === "list") && <p className="mt-1.5 text-xs text-dim">{field.hint || "One item per line."}</p>}
    {field.kind === "image" && <div className="mt-3 flex flex-wrap items-center gap-4">
      {current && /^(https?:\/\/|\/(?!\/)|data:image\/)/.test(current) && <img src={current} alt={`${field.label} preview`} className="h-24 w-36 rounded-lg border border-ink-line object-cover" />}
      <label className="btn-outline cursor-pointer text-xs"><ImagePlus className="h-4 w-4" />{uploading ? "Uploading image…" : "Upload image"}<input type="file" className="sr-only" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={e => { void upload(e.target.files?.[0]); e.target.value = "" }} /></label>
      {current && <button type="button" className="text-sm text-dim underline" onClick={() => onChange("")}>Remove image</button>}
      <p className="text-xs text-dim">JPG, PNG, WebP or GIF, up to 5 MB. Uploaded images are stored in Supabase.</p>
    </div>}
    {error && <p role="alert" className="mt-2 text-sm text-red-500">{error}</p>}
  </div>
}

export default function AdminEditor() {
  const { content, ready, storageError, revision, save, refresh } = useContent()
  const [baseRevision, setBaseRevision] = useState(revision)
  const [saving, setSaving] = useState(false)
  const [uploads, setUploads] = useState(0)
  const savingRef = useRef(false)
  const [draft, setDraft] = useState<Content>(content)
  const [dirty, setDirty] = useState(false)
  const [externalChange, setExternalChange] = useState(false)
  const [active, setActive] = useState("projects")
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
  async function saveChanges() {
    if (externalChange) { setErrors(["A newer version was published. Export your draft, then reload published content before applying your changes."]); return }
    // Blank lines are separators in list inputs, not content items.
    const clean = (item: unknown): unknown => Array.isArray(item) ? item.filter(x => typeof x !== "string" || x.trim()).map(clean)
      : item && typeof item === "object" ? Object.fromEntries(Object.entries(item).map(([key, val]) => [key, clean(val)])) : item
    const parsed = contentSchema.safeParse(clean(draft))
    if (!parsed.success) {
      setErrors(parsed.error.issues.map(issue => `${issue.path.join(" → ")}: ${issue.message}`))
      setActive(String(parsed.error.issues[0].path[0])); setMessage(""); return
    }
    setSaving(true); savingRef.current = true
    try {
      const published = await save(parsed.data, baseRevision)
      setDraft(published.content); setBaseRevision(published.revision); setDirty(false); setExternalChange(false); setErrors([])
      setMessage("Published successfully. Your changes are now available to every visitor.")
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Publishing failed. Your draft has been kept."])
    } finally { setSaving(false); savingRef.current = false }
  }
  async function reloadPublished() {
    if (dirty && !window.confirm("Discard your draft and reload the published version? Export a backup first if needed.")) return
    setSaving(true); savingRef.current = true
    try {
      const latest = await refresh()
      if (latest) { setDraft(latest.content); setBaseRevision(latest.revision); setDirty(false); setExternalChange(false); setErrors([]); setMessage("Loaded the latest published content.") }
    } finally { setSaving(false); savingRef.current = false }
  }
  function importBrowserDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) { setErrors(["No previous browser draft was found. You can import an exported JSON backup instead."]); return }
      const imported = backupSchema.parse(JSON.parse(raw))
      if (!window.confirm("Load the previous browser content into your draft? Review it before publishing to everyone.")) return
      setDraft(imported.content); setDirty(true); setErrors([]); setMessage("Browser draft loaded. Review it, then publish when ready.")
    } catch { setErrors(["The previous browser content could not be imported. Your published content is unchanged."]) }
  }
  function exportBackup() {
    if (!contentSchema.safeParse(draft).success) {
      setErrors(["Complete required fields and remove blank list lines before exporting, so this backup can be imported again."])
      return
    }
    const blob = new Blob([JSON.stringify({ version: 1, content: draft }, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage("Backup downloaded. It includes your current draft.")
  }
  async function importBackup(file?: File) {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setErrors(["The backup is too large (maximum 10 MB)."]); return }
    try {
      const parsed = backupSchema.safeParse(JSON.parse(await file.text()))
      if (!parsed.success) { setErrors(["This file is not a valid version 1 portfolio backup. Check required fields and project URLs."]); return }
      if (!window.confirm("Replace your current draft with this backup? It will only be stored when you click Publish changes.")) return
      setDraft(parsed.data.content); setDirty(true); setErrors([]); setMessage("Backup loaded into the editor. Review it, then publish changes.")
    } catch { setErrors(["Could not read the backup. Choose a valid portfolio JSON file."]) }
  }
  function move(index: number, offset: number) {
    const items = [...value as unknown[]]
    ;[items[index], items[index + offset]] = [items[index + offset], items[index]]
    change([active], items)
  }
  function fields(base: Path, item: unknown) {
    return <div className="grid gap-5 md:grid-cols-2">{section.fields.map(field => {
      const keys = field.key ? field.key.split(".") : []
      const path = [...base, ...keys]
      return <EditorField key={path.join(".")} field={field} path={path} value={read(item, keys)} onChange={next => change(path, next)} onUploadState={busy => setUploads(count => count + (busy ? 1 : -1))} />
    })}</div>
  }
  if (!ready) return <section className="container panel p-10" aria-busy="true">Loading your content…</section>
  return <section className="container pb-8"><fieldset disabled={saving || uploads > 0} className="min-w-0">
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-sm font-medium text-brand">YOUR PORTFOLIO</p><h1 className="mt-2 text-3xl font-bold text-fg">Content studio</h1><p className="mt-2 text-dim">Keep your story and your work up to date.</p></div>
      <Link href="/" target="_blank" className="btn-outline">View portfolio <ExternalLink className="h-4 w-4" /></Link>
    </div>
    <div className="mb-6 rounded-xl border border-brand/30 bg-badge/20 p-4 text-sm text-dim"><strong className="text-fg">Connected to Supabase.</strong> Publish changes to update your live portfolio for every visitor. Edits stay in this draft until you publish.</div>
    {storageError && <p role="alert" className="mb-4 rounded-lg border border-red-500/40 p-4 text-sm">{storageError}</p>}
    <div className="sticky top-20 z-30 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-line bg-ink-card p-4 shadow-sm md:top-24">
      <p className="text-sm text-dim" role="status">{dirty ? "● Unsaved changes" : "All changes saved locally"}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-outline" onClick={exportBackup}><Download className="h-4 w-4" />Export</button>
        <button type="button" className="btn-outline" onClick={() => importInput.current?.click()}><Upload className="h-4 w-4" />Import</button>
        <input ref={importInput} type="file" accept="application/json,.json" className="hidden" aria-label="Import portfolio backup" onChange={e => { void importBackup(e.target.files?.[0]); e.target.value = "" }} />
        <button type="button" className="btn-primary disabled:opacity-50" disabled={(!dirty && revision > 0) || Boolean(storageError) || externalChange} onClick={() => void saveChanges()}><Save className="h-4 w-4" />Publish changes</button>
      </div>
    </div>
    <div className="mb-4 flex flex-wrap gap-4 text-sm"><button type="button" className="text-dim underline" onClick={() => void reloadPublished()}>Reload published content</button><button type="button" className="text-dim underline" onClick={importBrowserDraft}>Import previous browser draft</button></div>
    {externalChange && <div role="alert" className="mb-4 rounded-lg border border-amber-500/50 p-4 text-sm">A newer version was published. Your draft is preserved. Export it if needed, then reload published content before applying your changes.</div>}

    {message && <p role="status" className="mb-4 rounded-lg border border-brand/40 p-4 text-sm">{message}</p>}
    {errors.length > 0 && <div role="alert" className="mb-4 rounded-lg border border-red-500/50 p-4"><p className="font-semibold">Please check these fields</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{errors.map((error, index) => <li key={index}>{error}</li>)}</ul></div>}
    <div className="grid items-start gap-6 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Content sections" className="panel flex gap-1 overflow-x-auto p-2 lg:flex-col">{sections.map(item => <button type="button" key={item.key} aria-current={active === item.key ? "page" : undefined} onClick={() => setActive(item.key)} className={`whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm font-medium transition ${active === item.key ? "bg-brand text-brand-fg" : "text-dim hover:bg-ink-raised"}`}>{item.title}{item.collection && <span className="ml-2 opacity-70">{(read(draft, [item.key]) as unknown[]).length}</span>}</button>)}</nav>
      <div className="min-w-0">
        <div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-2xl font-semibold text-fg">{section.title}</h2><p className="mt-2 text-sm text-dim">{section.description}</p></div>
          {section.collection && <button type="button" className="btn-primary shrink-0" onClick={() => change([active], [...value as unknown[], structuredClone(section.empty)])}><Plus className="h-4 w-4" />Add {active === "projects" ? "project" : "entry"}</button>}
        </div>
        {section.collection ? <div className="space-y-4">
          {(value as Record<string, unknown>[]).length === 0 && <div className="panel p-10 text-center text-dim">No entries yet. Add one to get started.</div>}
          {(value as Record<string, unknown>[]).map((item, index, items) => <details key={`${active}-${index}`} className="panel group p-5" open>
            <summary className="cursor-pointer text-lg font-semibold text-fg">{index + 1}. {String(item.title || item.name || item.course || item.project || "New entry")}</summary>
            <div className="my-5 flex flex-wrap items-center gap-2 border-b border-ink-line pb-4">
              <button type="button" className="btn-outline disabled:opacity-30" disabled={index === 0} aria-label={`Move entry ${index + 1} up`} onClick={() => move(index, -1)}><ArrowUp className="h-4 w-4" /></button>
              <button type="button" className="btn-outline disabled:opacity-30" disabled={index === items.length - 1} aria-label={`Move entry ${index + 1} down`} onClick={() => move(index, 1)}><ArrowDown className="h-4 w-4" /></button>
              <button type="button" className="btn-outline ml-auto" onClick={() => { if (window.confirm("Remove this entry from your draft? Publish changes to apply the removal.")) change([active], items.filter((_, i) => i !== index)) }}><Trash2 className="h-4 w-4" />Remove</button>
            </div>
            {fields([active, index], item)}
          </details>)}
        </div> : <div className="panel p-5 md:p-8">{fields([active], value)}</div>}
        <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-ink-line pt-5 text-sm">
          <button type="button" className="text-dim underline" onClick={() => { if (window.confirm("Discard unsaved changes?")) { setDraft(content); setBaseRevision(revision); setDirty(false); setErrors([]); setExternalChange(false); setMessage("") } }}>Discard draft</button>
          <button type="button" className="text-dim underline" onClick={() => { if (window.confirm("Load the original portfolio into the editor? Export a backup first. Publish changes to apply this reset.")) { setDraft(structuredClone(defaultContent)); setDirty(true); setErrors([]); setMessage("Original content loaded. Publish changes to apply the reset.") } }}>Restore original content</button>
        </div>
      </div>
    </div>
  </fieldset></section>
}
