//MyProfile page

import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import RiderProfilePageComponent from "./riderProfile"

export const metadata: Metadata = {
  title: `My Profile - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyProfilePage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const userDetails = await userServices.findUserDetailsWithDriverById(
    currentUser.userId,
  )
  if (!userDetails) {
    notFound()
  }

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myProfile"} />
      <MyProfileDetailHeaderTabs selectedTab={"Account"} />
      <RiderProfilePageComponent
        account={userDetails}
        sessionLoginAt={currentUser.createdAt}
      />
    </MainWrapper>
  )
}
