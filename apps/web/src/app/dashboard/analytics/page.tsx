//Analytics page (only accessible by owner)

import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import AnalyticsPageComponent from "./analytics"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { MainWrapper } from "@/components/page/pageWrappers"
import DashboardHeader from "@/components/header/dashboardHeader"

export const metadata: Metadata = {
  title: `Analytics - ${pageTitle}`,
  description: pageDescription,
}

export default async function AnalyticsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/analytics"} />
      <AnalyticsPageComponent agencyId={currentUser.agencyId} />
    </MainWrapper>
  )
}
