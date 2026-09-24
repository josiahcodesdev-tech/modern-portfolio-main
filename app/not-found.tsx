import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <section className="container">
      <div className="panel flex min-h-[60vh] flex-col items-center justify-center p-10 text-center">
        <p className="font-mono text-7xl font-bold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-bold text-fg">Page not found</h1>
        <p className="mt-2 text-dim">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="btn-primary mt-8">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </section>
  )
}
