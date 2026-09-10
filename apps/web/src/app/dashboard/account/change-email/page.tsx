//Change email flow

import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import ChangeEmailPageComponent from "@/components/flows/account/changeEmailPage"

export const metadata: Metadata = {
  title: `Change Email - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeEmailAccountPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const usersWithPhoneRole = await userServices.findUserAccountsByPhoneRole(
    currentUser.phone,
    currentUser.userRole,
  )
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/change-email"} />
      <ChangeEmailPageComponent
        usersWithPhoneRole={usersWithPhoneRole}
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
      />
    </MainWrapper>
  )
}
