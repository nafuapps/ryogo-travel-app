import { redirect, RedirectType } from "next/navigation"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function BookingDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  //No booking found or agency mismatch
  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Lead booking -> send to lead confirm page
  if (booking.status === BookingStatusEnum.LEAD) {
    redirect(`/dashboard/bookings/${bookingId}/confirm`, RedirectType.replace)
  }

  return children
}
