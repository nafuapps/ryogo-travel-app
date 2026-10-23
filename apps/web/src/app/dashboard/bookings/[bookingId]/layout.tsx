import { autoCancelBookingAction } from "@/app/actions/bookings/autoCancelBookingAction"
import { readPermissions } from "@/lib/permissions"
import { BookingIdRegex } from "@/lib/regex"
import { OLD_LEAD_AUTO_CANCEL_DAYS } from "@/lib/uiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import { redirect, RedirectType } from "next/navigation"

export default async function BookingIdLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ bookingId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { bookingId } = await params

  //Invalid booking id regex check
  if (!BookingIdRegex.safeParse(bookingId).success) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }
  //No booking found or agency mismatch
  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking || booking.agencyId !== currentUser.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //If it is an old lead booking, cancel it automatically
  if (
    booking.status === BookingStatusEnum.LEAD &&
    differenceInDays(new Date(), booking.startDate) > OLD_LEAD_AUTO_CANCEL_DAYS
  ) {
    await autoCancelBookingAction({
      bookingId: booking.id,
      agencyId: booking.agencyId,
    })
  }

  return children
}
