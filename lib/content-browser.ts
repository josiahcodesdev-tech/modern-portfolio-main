"use client"

import { contentSchema, type Content } from "./content"
import { parsePublishedRow } from "./published-content"
import { getSupabaseBrowser } from "./supabase/browser"

export async function fetchPublishedContent() {
  const { data, error } = await getSupabaseBrowser().from("portfolio_content")
    .select("content,revision,updated_at").eq("id", 1).maybeSingle()
  if (error) throw new Error("Published content could not be loaded. Check your connection and that the Supabase setup SQL has been run.")
  return parsePublishedRow(data)
}

export async function uploadImage(file: File | Blob) {
  const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" }
  const extension = extensions[file.type]
  if (!extension || file.size > 5 * 1024 * 1024) throw new Error("Choose a JPG, PNG, WebP or GIF image up to 5 MB.")
  const client = getSupabaseBrowser()
  const { data: { user }, error: authError } = await client.auth.getUser()
  if (authError || !user) throw new Error("Your session expired. Sign in again before uploading.")
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`
  const { error } = await client.storage.from("portfolio-media").upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw new Error("Image upload failed. Check your admin access, network connection, and the portfolio-media bucket setup.")
  return client.storage.from("portfolio-media").getPublicUrl(path).data.publicUrl
}

// Migrate embedded images in old browser backups into shared image storage.
async function migrateImages(content: Content) {
  const copy = structuredClone(content)
  const uploaded = new Map<string, string>()
  async function migrate(value: string | undefined) {
    if (!value?.startsWith("data:image/")) return value
    if (uploaded.has(value)) return uploaded.get(value)!
    const response = await fetch(value)
    const url = await uploadImage(await response.blob())
    uploaded.set(value, url)
    return url
  }
  copy.site.photo = (await migrate(copy.site.photo))!
  for (const project of copy.projects) {
    project.image = await migrate(project.image)
    if (project.images) {
      for (let i = 0; i < project.images.length; i++) project.images[i] = (await migrate(project.images[i]))!
    }
  }
  return copy
}

export async function publishContent(content: Content, expectedRevision: number) {
  const next = await migrateImages(contentSchema.parse(content))
  const { data, error } = await getSupabaseBrowser().rpc("publish_portfolio_content", {
    p_content: next, p_expected_revision: expectedRevision,
  })
  if (error?.code === "40001") throw new Error("Someone published a newer version. Reload published content, then reapply your changes. Your draft has been kept; you can export it first.")
  if (error) throw new Error("Publishing could not be confirmed. Your draft is kept. Check your admin access and connection, then reload published content before retrying.")
  return parsePublishedRow(data)
}
