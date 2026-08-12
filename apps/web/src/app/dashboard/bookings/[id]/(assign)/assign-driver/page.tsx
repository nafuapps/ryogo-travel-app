//Bookings/id/assign-driver page (for a lead/confirmed booking)

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
import AssignDriverPageComponent from "./assignDriver"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"
import { BASIC_PLAN_DRIVER_LIMIT, TRIAL_MODE } from "@/lib/uiConfig"
import { MainWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export const metadata: Metadata = {
  title: `Assign Driver - ${pageTitle}`,
  description: pageDescription,
}

export default async function AssignDriverBookingPage({
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

  //Only lead and confirmed bookings can be assigned driver
  if (
    ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
      booking.status,
    )
  ) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  //Only owner or assigned agent can assign driver
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

  //Get driver data with their bookings and leaves from DB
  const allDrivers = await driverServices.findDriversByAgency(
    currentUser.agencyId,
  )

  let drivers = allDrivers
  let limited = false

  //SUBSCRIPTION BLOCKER: Limit the drivers available for assignment
  if (
    !TRIAL_MODE &&
    (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
      agency.subscriptionExpiresOn < new Date()) &&
    allDrivers.length > BASIC_PLAN_DRIVER_LIMIT
  ) {
    limited = true
    const assignedDriver = allDrivers.find(
      (d) => d.id === booking.assignedDriverId,
    )
    drivers = drivers
      .sort((d1, d2) => d2.createdAt.getTime() - d1.createdAt.getTime())
      .slice(0, BASIC_PLAN_DRIVER_LIMIT)
    if (
      assignedDriver &&
      !drivers.some((d) => d.id === booking.assignedDriverId)
    ) {
      drivers.splice(-1, 1, assignedDriver)
    }
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/assign-driver"} />
      <AssignDriverPageComponent
        bookingId={id}
        drivers={limited ? drivers : allDrivers}
        booking={booking}
        limited={limited}
        isSubscribed={agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC}
        hasTriedSubscription={agency.hasTriedSubscription}
      />
    </MainWrapper>
  )
}
