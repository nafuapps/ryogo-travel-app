import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { BookingIdRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import { cancelBookingAction } from "@/app/actions/bookings/cancelBookingAction"
import { OLD_LEAD_AUTO_CANCEL_DAYS } from "@/lib/uiConfig"

export default async function BookingIdLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  //Invalid booking id regex check
  if (!BookingIdRegex.safeParse(id).success) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //No booking found or agency mismatch
  const booking = await bookingServices.findBookingStatusById(id)
  if (!booking || booking.agencyId !== currentUser.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //If it is an old lead booking, cancel it automatically
  if (
    booking.status === BookingStatusEnum.LEAD &&
    differenceInDays(new Date(), booking.startDate) > OLD_LEAD_AUTO_CANCEL_DAYS
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

  return children
}
