import {
  mainClassName,
  pageClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import MyProfileDetailHeaderTabs from "../myProfileHeaderTabs"
import MyProfileSettingsPageComponent from "./settings"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `My Settings - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyProfileSettingsPage() {
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
      <RiderHeader pathName={"/rider/myProfile/settings"} />
      <div id="AccountSettingsPage" className={pageClassName}>
        <MyProfileDetailHeaderTabs selectedTab="Settings" />
        <MyProfileSettingsPageComponent userDetails={userDetails} />
      </div>
    </div>
  )
}
