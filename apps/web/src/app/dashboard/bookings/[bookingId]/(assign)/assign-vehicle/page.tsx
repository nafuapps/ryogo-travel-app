import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_VEHICLE_LIMIT,
} from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import AssignVehiclePageComponent from "./assignVehicle"

export const metadata: Metadata = {
  title: `Assign Vehicle - ${pageTitle}`,
  description: pageDescription,
}

export default async function AssignVehicleBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { bookingId } = await params

  //Get booking details from DB
  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Only lead and confirmed bookings can be assigned vehicles
  if (
    ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
      booking.status,
    )
  ) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  //Only owner or assigned agent can assign vehicle
  if (
    currentUser.userRole !== UserRolesEnum.OWNER &&
    booking.assignedUserId !== currentUser.userId
  ) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  const isSubscribed = currentUser.isSubscribed

  //Get vehicle data with their bookings and repairs
  const allVehicles = await vehicleServices.findVehiclesByAgency(
    currentUser.agencyId,
  )

  let vehicles = allVehicles
  let limited = false

  //SUBSCRIPTION BLOCKER: Limit the vehicles available for assignment
  if (
    !APP_TRIAL_MODE &&
    (!isSubscribed || currentUser.subscriptionExpiresOn < new Date()) &&
    allVehicles.length > BASIC_PLAN_VEHICLE_LIMIT
  ) {
    limited = true
    const assignedVehicle = allVehicles.find(
      (v) => v.id === booking.assignedVehicleId,
    )
    vehicles = vehicles
      .sort((v1, v2) => v2.createdAt.getTime() - v1.createdAt.getTime())
      .slice(0, BASIC_PLAN_VEHICLE_LIMIT)
    if (
      assignedVehicle &&
      !vehicles.some((v) => v.id === booking.assignedVehicleId)
    ) {
      vehicles.splice(-1, 1, assignedVehicle)
    }
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/assign-vehicle"} />
      <AssignVehiclePageComponent
        bookingId={bookingId}
        vehicles={limited ? vehicles : allVehicles}
        booking={booking}
        limited={limited}
        isSubscribed={isSubscribed}
        hasTriedSubscription={currentUser.hasTriedSubscription}
      />
    </MainWrapper>
  )
}
