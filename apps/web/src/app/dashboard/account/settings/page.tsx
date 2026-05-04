import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "@/components/header/dashboardHeader"
import AccountSettingsPageComponent from "./settings"
import AccountDetailHeaderTabs from "../accountDetailHeaderTabs"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Settings - ${pageTitle}`,
  description: pageDescription,
}

export default async function AccountSettingsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  const userDetails = await userServices.findUserDetailsById(user.userId)

  if (!userDetails) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/settings"} />
      <PageWrapper id="AccountSettingsPage">
        <AccountDetailHeaderTabs selectedTab="Settings" />
        <AccountSettingsPageComponent userDetails={userDetails} />
      </PageWrapper>
    </MainWrapper>
  )
}
