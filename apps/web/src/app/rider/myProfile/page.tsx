//MyProfile page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import RiderProfilePageComponent from "./riderPofile"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `My Profile - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyProfilePage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const driverDetails = await driverServices.findDriverByUserId(
    currentUser.userId,
  )

  if (!driverDetails) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myProfile"} />
      <RiderProfilePageComponent driverDetails={driverDetails} />
    </MainWrapper>
  )
}
