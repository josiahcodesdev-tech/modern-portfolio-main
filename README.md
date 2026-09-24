# Josiah Mwangi Portfolio

Personal developer portfolio built with Next.js 15 and Tailwind CSS.

## Pages

- `/`: profile card, intro, skills strip, featured projects
- `/about`: bio, experience, education, testimonials
- `/skills`: frontend, backend, and tools & deployment
- `/projects` and `/projects/[slug]`: all projects, each with its own detail page (tools, description, deliverables)

## Content studio

Open `/admin` (also linked in the footer) to manage projects, profile/contact information, page text, skills, experience, education, testimonials, and open-source contributions.

- Add, edit, remove, or reorder projects. The first three appear on Home.
- Choose a unique lowercase project URL such as `my-new-project`; newly added project pages work on direct visits and reloads in the same browser.
- Upload small JPG, PNG, WebP, or GIF images (up to 1 MB each), or use an image URL / existing `/public-file` path. Use URLs for larger image collections; browser storage has a limited total quota.
- Click **Save changes** to apply your draft. **Discard draft** loads the last saved content.
- **Export** downloads a versioned JSON backup; **Import** loads a validated backup into the editor for review before saving. Save a completed draft before exporting.
- **Restore original content** loads the original portfolio into the editor; save to apply it.

This version is frontend-only, as requested. Content is stored in localStorage under `portfolio-content-v1`, scoped to this browser and site origin. Saved changes synchronize across open tabs. They do not publish to other visitors, devices, or domains. Clearing browser data removes saved changes, so keep backups. There is no authentication; anyone with access to this browser can edit its local copy. The admin page requests no indexing.

The shipped content in `lib/site.ts` and `lib/data.ts` remains the fallback for new visitors and unavailable/corrupt storage. Search engine and social metadata still use the shipped content because local browser edits are not available on the server. No Supabase account or environment variables are required for this version.

## Verification

```bash
pnpm exec tsc --noEmit
pnpm exec playwright install chromium # first run only
pnpm exec playwright test
```

Browser tests cover editing, reload persistence, tab synchronization, new project routes, ordering/removal, validation, damaged storage, and storage quota failures.

## Running locally

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start   # production build
```
