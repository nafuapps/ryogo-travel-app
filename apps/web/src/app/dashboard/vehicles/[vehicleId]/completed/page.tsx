import DashboardHeader from "@/components/header/dashboardHeader"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { Metadata } from "next"
import VehicleCompletedBookingsPageComponent from "./vehicleCompletedBookings"

export const metadata: Metadata = {
  title: `Vehicle Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function VehicleCompletedBookingsPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const isSubscribed = currentUser.isSubscribed

  const { vehicleId } = await params
  const bookings = await vehicleServices.findVehicleCompletedBookingsById(
    vehicleId,
    isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/completed"} />
      <VehicleDetailHeaderTabs selectedTab={"Completed"} id={vehicleId} />
      <VehicleCompletedBookingsPageComponent bookings={bookings} />
    </MainWrapper>
  )
}
