import { z } from "zod"
import { contentSchema, defaultContent, type Content } from "./content"

export const publishedRowSchema = z.object({ content: contentSchema, revision: z.number().int().positive(), updated_at: z.string() })
export type ContentSnapshot = { content: Content; revision: number; updatedAt: string | null; error: string }
export function emptySnapshot(error = ""): ContentSnapshot {
  return { content: defaultContent, revision: 0, updatedAt: null, error }
}
export function parsePublishedRow(row: unknown): ContentSnapshot {
  if (!row) return emptySnapshot()
  const parsed = publishedRowSchema.parse(row)
  return { content: parsed.content, revision: parsed.revision, updatedAt: parsed.updated_at, error: "" }
}
