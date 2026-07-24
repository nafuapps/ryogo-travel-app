import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import MyProfileSettingsPageComponent from "./settings"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `My Settings - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyProfileSettingsPage() {
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
      <RiderHeader pathName={"/rider/myProfile/settings"} />
      <MyProfileSettingsPageComponent userDetails={userDetails} />
    </MainWrapper>
  )
}
