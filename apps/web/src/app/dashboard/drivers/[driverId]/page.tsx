//Drivers/id (details) page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import DriverDetailsPageComponent from "./driverDetails"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `Driver Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function DriverDetailsPage({
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
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]"} />
      <DriverDetailsPageComponent
        driver={driver}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
