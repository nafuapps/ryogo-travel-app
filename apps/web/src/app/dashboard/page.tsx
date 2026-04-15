//Dashboard home page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHomePageComponent from "./dashboardHome"
import DashboardHeader from "./components/common/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

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
