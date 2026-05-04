//Dashboard home page

import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import DashboardHomePageComponent from "./dashboardHome"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Dashboard - ${pageTitle}`,
  description: pageDescription,
}

export default async function DashboardHomePage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard"} />
      <DashboardHomePageComponent agencyId={currentUser.agencyId} />
    </MainWrapper>
  )
}
