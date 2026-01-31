//bookings/id/confirm page (for lead booking)

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import ConfirmBookingPageComponent from "./confirmBooking"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { BookingRegex } from "@/lib/regex"
import { getCurrentUser } from "@/lib/auth"
import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { cancelBookingAction } from "@/app/actions/bookings/cancelBookingAction"

export default async function ConfirmBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  //Invalid booking id regex
  if (!BookingRegex.safeParse(id).success) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //No booking found or agency mismatch
  const booking = await bookingServices.findLeadBookingById(id)
  if (!booking || booking.agency.id != user?.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Not a lead booking -> send to details page
  if (booking?.status != BookingStatusEnum.LEAD) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  //If the lead is old, cancel it automatically
  if (new Date(booking.endDate) < new Date()) {
    if (await cancelBookingAction(booking.id)) {
      redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
    } else {
      redirect(`/dashboard/bookings`, RedirectType.replace)
    }
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/confirm"} />
      <ConfirmBookingPageComponent
        booking={booking}
        isOwner={user.userRole == UserRolesEnum.OWNER}
        isAssignedUser={booking.assignedUser.id === user?.userId}
      />
    </div>
  )
}
