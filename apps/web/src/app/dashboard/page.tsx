import { redirect, RedirectType } from "next/navigation"

export default async function DashboardPage() {
  redirect("/dashboard/home", RedirectType.replace)
}
