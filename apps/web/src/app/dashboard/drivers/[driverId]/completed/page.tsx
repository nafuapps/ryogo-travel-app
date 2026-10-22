import DashboardHeader from "@/components/header/dashboardHeader"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import DriverCompletedBookingsPageComponent from "./driverCompletedBookings"

export const metadata: Metadata = {
  title: `Driver Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function DriverCompletedBookingsPage({
  params,
}: {
  params: Promise<{ driverId: string }>
}) {
  const { driverId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const bookings = await driverServices.findDriverCompletedBookingsById(
    driverId,
    currentUser.isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/completed"} />
      <DriverDetailHeaderTabs selectedTab={"Completed"} id={driverId} />
      <DriverCompletedBookingsPageComponent bookings={bookings} />
    </MainWrapper>
  )
}
