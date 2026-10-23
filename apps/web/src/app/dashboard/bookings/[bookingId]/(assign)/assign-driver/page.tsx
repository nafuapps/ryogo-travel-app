import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_DRIVER_LIMIT,
} from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import AssignDriverPageComponent from "./assignDriver"

export const metadata: Metadata = {
  title: `Assign Driver - ${pageTitle}`,
  description: pageDescription,
}

export default async function AssignDriverBookingPage({
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

  //Only lead and confirmed bookings can be assigned driver
  if (
    ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
      booking.status,
    )
  ) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  //Only owner or assigned agent can assign driver
  if (
    currentUser.userRole !== UserRolesEnum.OWNER &&
    booking.assignedUserId !== currentUser.userId
  ) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }
  const isSubscribed = currentUser.isSubscribed

  //Get driver data with their bookings and leaves from DB
  const allDrivers = await driverServices.findDriversByAgency(
    currentUser.agencyId,
  )

  let drivers = allDrivers
  let limited = false

  //SUBSCRIPTION BLOCKER: Limit the drivers available for assignment
  if (
    !APP_TRIAL_MODE &&
    (!isSubscribed || currentUser.subscriptionExpiresOn < new Date()) &&
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
        bookingId={bookingId}
        drivers={limited ? drivers : allDrivers}
        booking={booking}
        limited={limited}
        isSubscribed={isSubscribed}
        hasTriedSubscription={currentUser.hasTriedSubscription}
      />
    </MainWrapper>
  )
}
