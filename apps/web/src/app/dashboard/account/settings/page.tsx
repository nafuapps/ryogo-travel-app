import {
  mainClassName,
  pageClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "../../components/dashboardHeader"
import AccountSettingsPageComponent from "./settings"
import AccountDetailHeaderTabs from "../accountDetailHeaderTabs"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

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
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account/settings"} />
      <div id="AccountSettingsPage" className={pageClassName}>
        <AccountDetailHeaderTabs selectedTab="Settings" />
        <AccountSettingsPageComponent userDetails={userDetails} />
      </div>
    </div>
  )
}
