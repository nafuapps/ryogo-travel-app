//Driver Leaves page

import DashboardHeader from "@/components/header/dashboardHeader"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import AllDriverLeavesPageComponent from "./allDriverLeaves"

export const metadata: Metadata = {
  title: `Driver Leaves - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllDriverLeavesPage({
  params,
}: {
  params: Promise<{ driverId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { driverId } = await params

  const driver = await driverServices.findDriverDetailsById(driverId)
  if (!driver) {
    redirect("/dashboard/drivers", RedirectType.replace)
  }

  const driverLeaves =
    await driverServices.findAllDriverLeavesByDriverId(driverId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/leaves"} />
      <DriverDetailHeaderTabs selectedTab={"Leaves"} id={driverId} />
      <AllDriverLeavesPageComponent
        leaves={driverLeaves}
        driver={driver}
        currentUserId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
