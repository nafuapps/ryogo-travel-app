"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export async function rateBookingByDriverAction(
  bookingId: string,
  customerId: string,
  agencyId: string,
  bookingRatingByDriver: number,
  customerRatingByDriver?: number,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.DRIVER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const updatedBooking = await bookingServices.changeBookingRatingByDriver(
    bookingId,
    customerId,
    currentUser.userId,
    bookingRatingByDriver,
    customerRatingByDriver,
  )
  if (!updatedBooking) {
    return
  }
  return updatedBooking
}
