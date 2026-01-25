//Dashboard home page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHomePageComponent from "./dashboardHome"
import DashboardHeader from "./components/extra/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export default async function DashboardHomePage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard"} />
      <DashboardHomePageComponent agencyId={currentUser.agencyId} />
    </div>
  )
}
