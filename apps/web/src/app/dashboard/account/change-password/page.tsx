//Change password flow

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import ChangePasswordPageComponent from "@/components/flows/account/changePasswordPage"

export const metadata: Metadata = {
  title: `Change Password - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangePasswordAccountPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/change-password"} />
      <ChangePasswordPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
      />
    </MainWrapper>
  )
}
