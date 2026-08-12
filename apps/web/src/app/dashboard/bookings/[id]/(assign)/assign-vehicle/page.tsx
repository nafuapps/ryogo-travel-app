//Bookings/id/assign-vehicle page (for a lead/confirmed booking)

import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  BookingStatusEnum,
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import AssignVehiclePageComponent from "./assignVehicle"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { Metadata } from "next"
import { TRIAL_MODE, BASIC_PLAN_VEHICLE_LIMIT } from "@/lib/uiConfig"
import { MainWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export const metadata: Metadata = {
  title: `Assign Vehicle - ${pageTitle}`,
  description: pageDescription,
}

export default async function AssignVehicleBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  //Get current user
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Get booking details from DB
  const booking = await bookingServices.findBookingDetailsById(id)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Only lead and confirmed bookings can be assigned vehicles
  if (
    ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
      booking.status,
    )
  ) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  //Only owner or assigned agent can assign vehicle
  if (
    currentUser.userRole !== UserRolesEnum.OWNER &&
    booking.assignedUser.id !== currentUser.userId
  ) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  //Get agency details from DB
  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Get vehicle data with their bookings and repairs
  const allVehicles = await vehicleServices.findVehiclesByAgency(
    currentUser.agencyId,
  )

  let vehicles = allVehicles
  let limited = false

  //SUBSCRIPTION BLOCKER: Limit the vehicles available for assignment
  if (
    !TRIAL_MODE &&
    (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
      agency.subscriptionExpiresOn < new Date()) &&
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
        bookingId={id}
        vehicles={limited ? vehicles : allVehicles}
        booking={booking}
        limited={limited}
        isSubscribed={agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC}
        hasTriedSubscription={agency.hasTriedSubscription}
      />
    </MainWrapper>
  )
}
