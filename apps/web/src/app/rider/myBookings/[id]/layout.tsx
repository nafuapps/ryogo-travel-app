//Layout for booking details pages

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { BookingRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export default async function RiderMyBookingLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Invalid booking id regex check
  if (!BookingRegex.safeParse(id).success) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  //No booking found or agency mismatch
  const booking = await bookingServices.findBookingDetailsById(id)
  if (!booking || booking.agencyId != currentUser.agencyId) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  //Lead or cancelled or unassigned bookings are not accessible
  if (
    !booking ||
    booking.assignedDriverId == null ||
    booking.assignedVehicleId == null ||
    [BookingStatusEnum.CANCELLED, BookingStatusEnum.LEAD].includes(
      booking.status,
    )
  ) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  const driver = await driverServices.findDriverDetailsById(
    booking.assignedDriverId,
  )

  //Assigned driver user is not the same as current user
  if (!driver || driver.userId != currentUser.userId) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  return children
}
