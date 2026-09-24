import type { Metadata } from "next"
import AdminAccess from "@/components/admin-access"

export const metadata: Metadata = { title: "Content studio", robots: { index: false, follow: false } }
export default function AdminPage() { return <AdminAccess /> }
