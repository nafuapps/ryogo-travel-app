import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import MyProfileSettingsPageComponent from "./settings"

export const metadata: Metadata = {
  title: `My Settings - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyProfileSettingsPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const userDetails = await userServices.findUserDetailsById(currentUser.userId)
  if (!userDetails) {
    notFound()
  }

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myProfile/settings"} />
      <MyProfileDetailHeaderTabs selectedTab="Settings" />
      <MyProfileSettingsPageComponent userDetails={userDetails} />
    </MainWrapper>
  )
}
