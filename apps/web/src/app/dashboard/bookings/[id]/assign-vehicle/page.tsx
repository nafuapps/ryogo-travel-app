//Bookings/id/assign-vehicle page (for a lead/confirmed booking)

import { BookingRegex } from "@/lib/regex"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  BookingStatusEnum,
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { cancelBookingAction } from "@/app/actions/bookings/cancelBookingAction"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import AssignVehiclePageComponent from "./assignVehicle"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { Metadata } from "next"
import { differenceInDays } from "date-fns"
import {
  OLD_LEAD_AUTO_CANCEL_DAYS,
  TRIAL_MODE,
  BASIC_PLAN_VEHICLE_LIMIT,
} from "@/lib/uiConfig"
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
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  //Invalid booking id regex
  if (!BookingRegex.safeParse(id).success) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  const booking = await bookingServices.findBookingDetailsById(id)

  //No booking found or agency mismatch
  if (!booking || booking.agency.id !== currentUser.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //If it is a lead booking and old, cancel it automatically
  if (
    booking.status === BookingStatusEnum.LEAD &&
    differenceInDays(new Date(), booking.endDate) > OLD_LEAD_AUTO_CANCEL_DAYS
  ) {
    if (
      await cancelBookingAction(
        booking.id,
        booking.agencyId,
        booking.assignedUserId,
      )
    ) {
      redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
    } else {
      redirect(`/dashboard/bookings`, RedirectType.replace)
    }
  }

  //Only lead and confirmed bookings can be assigned vehicles
  if (
    booking.status !== BookingStatusEnum.LEAD &&
    booking.status !== BookingStatusEnum.CONFIRMED
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

  //SUBSCRIPTION BLOCKER: Limited vehicles available for assignment
  if (
    !TRIAL_MODE &&
    (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
      agency.subscriptionExpiresOn < new Date())
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
      />
    </MainWrapper>
  )
}
