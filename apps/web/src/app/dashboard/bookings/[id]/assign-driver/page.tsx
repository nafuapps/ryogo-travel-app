//Bookings/id/assign-driver page (for a lead/confirmed booking)

import { BookingRegex } from "@/lib/regex"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { cancelBookingAction } from "@/app/actions/bookings/cancelBookingAction"
import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import AssignDriverPageComponent from "./assignDriver"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export default async function AssignDriverBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  //Invalid booking id regex
  if (!BookingRegex.safeParse(id).success) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  const booking = await bookingServices.findBookingDetailsById(id)

  //No booking found or agency mismatch
  if (!booking || booking.agency.id !== user.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //If it is a lead booking and old, cancel it automatically
  if (
    booking.status === BookingStatusEnum.LEAD &&
    new Date(booking.endDate) < new Date()
  ) {
    if (await cancelBookingAction(booking.id)) {
      redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
    } else {
      redirect(`/dashboard/bookings`, RedirectType.replace)
    }
  }

  //Only lead and confirmed bookings can be assigned drivers
  if (
    booking.status !== BookingStatusEnum.LEAD &&
    booking.status !== BookingStatusEnum.CONFIRMED
  ) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  //Only owner or assigned agent can assign driver
  if (
    user.userRole !== UserRolesEnum.OWNER &&
    booking.assignedUser.id !== user.userId
  ) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  //Get driver data with their bookings and leaves
  const drivers = await driverServices.findDriversByAgency(user.agencyId)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/assign-driver"} />
      <AssignDriverPageComponent
        bookingId={id}
        drivers={drivers}
        booking={booking}
      />
    </div>
  )
}
