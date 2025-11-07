//Layout for booking details pages

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { BookingRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  //Invalid booking id regex check
  if (!BookingRegex.safeParse(id).success) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //No booking found or agency mismatch
  const booking = await bookingServices.findBookingStatusById(id)
  if (!booking || booking.agencyId !== user?.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Lead booking -> send to confirm page
  if (booking?.status == BookingStatusEnum.LEAD) {
    redirect(`/dashboard/bookings/${id}/confirm`, RedirectType.replace)
  }
  return children
}
