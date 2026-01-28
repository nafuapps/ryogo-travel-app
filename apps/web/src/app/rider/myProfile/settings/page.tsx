//Settings for user account

import { mainClassName, pageClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "../../components/riderHeader"
import MyProfileDetailHeaderTabs from "../myProfileHeaderTabs"
import MyProfileSettingsPageComponent from "./settings"

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
