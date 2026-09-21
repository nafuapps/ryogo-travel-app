//Drivers/id (details) page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import DriverDetailsPageComponent from "./driverDetails"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import {
  ProductFeedbackTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"

export const metadata: Metadata = {
  title: `Driver Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function DriverDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ driverId: string }>
  searchParams: Promise<{ feedback?: string | undefined }>
}) {
  const { driverId } = await params

  const feedback = (await searchParams).feedback

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
      {feedback === "true" && (
        <NewFeedbackComponent
          entityId={driverId}
          feedbackType={ProductFeedbackTypeEnum.NEW_DRIVER}
          userId={currentUser.userId}
          agencyId={currentUser.agencyId}
        />
      )}
      <DriverDetailsPageComponent
        driver={driver}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
