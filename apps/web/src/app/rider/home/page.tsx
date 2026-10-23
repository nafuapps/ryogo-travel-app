//Rider home page

import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import RiderHomePageComponent from "./riderHome"

export const metadata: Metadata = {
  title: `Rider Home - ${pageTitle}`,
  description: pageDescription,
}

export default async function RiderHomePage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    notFound()
  }

  const isSubscribed = currentUser.isSubscribed

  const assignedBookings = await driverServices.findDriverAssignedBookingsById(
    driver.id,
    isSubscribed ? PREMIUM_SEARCH_DAYS : BASIC_SEARCH_LIMIT_DAYS,
  )

  const driverLeaves = await driverServices.findAllDriverLeavesByDriverId(
    driver.id,
  )

  const driverActivities = await notificationServices.findNotificationsByUserId(
    driver.userId,
    isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/home"} />
      <RiderHomePageComponent
        assignedBookings={assignedBookings}
        driverLeaves={driverLeaves}
        driverActivities={driverActivities}
        driver={driver}
      />
    </MainWrapper>
  )
}
