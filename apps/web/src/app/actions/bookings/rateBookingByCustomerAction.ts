"use server"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export async function rateBookingByCustomerAction(
  bookingId: string,
  driverId: string,
  code: string,
  bookingRatingByCustomer: number,
  driverRatingByCustomer?: number,
) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    redirect(
      currentUser.userRole === UserRolesEnum.DRIVER
        ? "/rider/home"
        : "/dashboard/home",
      RedirectType.replace,
    )
  }
  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (
    !bookingDetails ||
    bookingDetails.status !== BookingStatusEnum.COMPLETED ||
    bookingDetails.ratingByCustomer
  )
    return

  const updatedBooking = await bookingServices.changeBookingRatingByCustomer(
    bookingId,
    driverId,
    code,
    bookingRatingByCustomer,
    driverRatingByCustomer,
  )
  return updatedBooking
}
