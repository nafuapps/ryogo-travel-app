import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import MyLeavesPageComponent from "./myLeaves"

export const metadata: Metadata = {
  title: `My Leaves - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyLeavesPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    notFound()
  }

  const driverLeaves = await driverServices.findAllDriverLeavesByDriverId(
    driver.id,
  )

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myLeaves"} />
      <MyLeavesPageComponent leaves={driverLeaves} driver={driver} />
    </MainWrapper>
  )
}
