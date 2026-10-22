import DashboardHeader from "@/components/header/dashboardHeader"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import VehicleAssignedBookingsPageComponent from "./vehicleAssignedBookings"

export const metadata: Metadata = {
  title: `Vehicle Assigned Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function VehicleAssignedBookingsPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isSubscribed = currentUser.isSubscribed

  const { vehicleId } = await params

  const bookings = await vehicleServices.findVehicleAssignedBookingsById(
    vehicleId,
    isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/assigned"} />
      <VehicleDetailHeaderTabs selectedTab={"Assigned"} id={vehicleId} />
      <VehicleAssignedBookingsPageComponent
        bookings={bookings}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        userId={currentUser.userId}
      />
    </MainWrapper>
  )
}
