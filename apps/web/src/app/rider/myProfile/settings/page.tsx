import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import MyProfileDetailHeaderTabs from "@/components/header/myProfileHeaderTabs"
import MyProfileSettingsPageComponent from "./settings"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"

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
    <MainWrapper>
      <RiderHeader pathName={"/rider/myProfile/settings"} />
      <PageWrapper id="RiderAccountSettingsPage">
        <MyProfileDetailHeaderTabs selectedTab="Settings" />
        <MyProfileSettingsPageComponent userDetails={userDetails} />
      </PageWrapper>
    </MainWrapper>
  )
}
