//Account page

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import AccountPageComponent from "./account"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Account - ${pageTitle}`,
  description: pageDescription,
}

export default async function AccountPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const userDetails = await userServices.findUserDetailsById(currentUser.userId)

  if (!userDetails) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account"} />
      <AccountPageComponent userDetails={userDetails} />
    </MainWrapper>
  )
}
