# Josiah Mwangi Portfolio

Personal developer portfolio built with Next.js 15 and Tailwind CSS.

## Pages

- `/`: profile card, intro, skills strip, featured projects
- `/about`: bio, experience, education, testimonials
- `/skills`: frontend, backend, and tools & deployment
- `/projects` and `/projects/[slug]`: all projects, each with its own detail page (tools, description, deliverables)

## Editing content

- `lib/site.ts`: name, role, email, WhatsApp number, resume file, photo, GitHub/LinkedIn
- `lib/data.ts`: skills, projects, experience, education, testimonials, open source work

Put images and your CV in `public/`, then point to them from those files. For example, set `photo: "/josiah.jpg"`, add `image: "/projects/gradelevate.png"` to a project, or set `resume: "/Josiah-Mwangi-Resume.pdf"`.

## Running locally

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start   # production build
```
