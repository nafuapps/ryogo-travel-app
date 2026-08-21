import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { BookingIdRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export default async function BookingIdLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  //Invalid booking id regex check
  if (!BookingIdRegex.safeParse(bookingId).success) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //No booking found or agency mismatch
  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking || booking.agencyId !== currentUser.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  return children
}
