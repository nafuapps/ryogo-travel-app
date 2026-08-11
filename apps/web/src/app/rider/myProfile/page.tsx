//MyProfile page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import RiderProfilePageComponent from "./riderProfile"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export const metadata: Metadata = {
  title: `My Profile - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyProfilePage() {
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
      <RiderHeader pathName={"/rider/myProfile"} />
      <RiderProfilePageComponent userDetails={userDetails} />
    </MainWrapper>
  )
}
