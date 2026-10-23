import DashboardHeader from "@/components/header/dashboardHeader"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import DriverAssignedBookingsPageComponent from "./driverAssignedBookings"

export const metadata: Metadata = {
  title: `Driver Assigned Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function DriverAssignedBookingsPage({
  params,
}: {
  params: Promise<{ driverId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const isSubscribed = currentUser.isSubscribed

  const { driverId } = await params

  const bookings = await driverServices.findDriverAssignedBookingsById(
    driverId,
    isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/assigned"} />
      <DriverDetailHeaderTabs selectedTab={"Assigned"} id={driverId} />
      <DriverAssignedBookingsPageComponent
        bookings={bookings}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        userId={currentUser.userId}
      />
    </MainWrapper>
  )
}
