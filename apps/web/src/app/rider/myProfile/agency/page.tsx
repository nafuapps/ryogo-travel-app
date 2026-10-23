import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import MyProfileAgencyDetailsPageComponent from "./myProfileAgencyDetails"

export const metadata: Metadata = {
  title: `My Agency - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyProfileAgencyDetailsPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    notFound()
  }

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    notFound()
  }

  const assignedUser = await userServices.findAssignedUserByDriverId(driver.id)

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myProfile/agency"} />
      <MyProfileDetailHeaderTabs selectedTab="Agency" />
      <MyProfileAgencyDetailsPageComponent
        agency={agency}
        assignedUser={assignedUser}
      />
    </MainWrapper>
  )
}
