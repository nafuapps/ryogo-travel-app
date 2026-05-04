//Account/agency details page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import MyProfileAgencyDetailsPageComponent from "./myProfileAgencyDetails"
import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `My Agency - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyProfileAgencyDetailsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }

  const assignedUser = await userServices.findAssignedUserByDriverId(driver.id)

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myProfile/agency"} />
      <MyProfileAgencyDetailsPageComponent
        agency={agency}
        assignedUser={assignedUser}
      />
    </MainWrapper>
  )
}
