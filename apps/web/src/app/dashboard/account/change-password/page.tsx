//Change password flow

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import ChangePasswordAccountComponent from "./changePassword"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Change Password - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangePasswordAccountPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/change-password"} />
      <ChangePasswordAccountComponent
        userId={user.userId}
        agencyId={user.agencyId}
      />
    </MainWrapper>
  )
}
