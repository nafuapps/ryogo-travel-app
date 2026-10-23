//Drivers/id (details) page

import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"
import DashboardHeader from "@/components/header/dashboardHeader"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import {
  ProductFeedbackTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import DriverDetailsPageComponent from "./driverDetails"

export const metadata: Metadata = {
  title: `Driver Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function DriverDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ driverId: string }>
  searchParams: Promise<{ feedback?: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { driverId } = await params

  const driver = await driverServices.findDriverDetailsById(driverId)
  if (!driver) {
    redirect("/dashboard/drivers", RedirectType.replace)
  }

  const feedback = (await searchParams).feedback

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]"} />
      {feedback === "true" && (
        <NewFeedbackComponent
          entityId={driverId}
          feedbackType={ProductFeedbackTypeEnum.NEW_DRIVER}
          userId={currentUser.userId}
          agencyId={currentUser.agencyId}
        />
      )}
      <DriverDetailHeaderTabs selectedTab={"Driver"} id={driverId} />
      <DriverDetailsPageComponent
        driver={driver}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
