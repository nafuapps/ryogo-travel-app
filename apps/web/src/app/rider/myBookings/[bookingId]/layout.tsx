import { readPermissions } from "@/lib/permissions"
import { BookingIdRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function RiderMyBookingLayout({
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
    redirect("/rider/myBookings", RedirectType.replace)
  }

  //No booking found or agency mismatch or no driver assigned or booking not accessible (lead,cancelled)
  const booking = await bookingServices.findBookingDetailsById(bookingId)
  if (
    !booking ||
    booking.agencyId !== currentUser.agencyId ||
    booking.assignedDriverId === null ||
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
  if (!driver || driver.userId !== currentUser.userId) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  return children
}
