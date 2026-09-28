//Driver Leaves page

import DashboardHeader from "@/components/header/dashboardHeader"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import AllDriverLeavesPageComponent from "./allDriverLeaves"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"

export const metadata: Metadata = {
  title: `Driver Leaves - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllDriverLeavesPage({
  params,
}: {
  params: Promise<{ driverId: string }>
}) {
  const { driverId } = await params
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

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
