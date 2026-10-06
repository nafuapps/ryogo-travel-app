"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { RateBookingByDriverType } from "@ryogo-travel-app/api/types/booking.types"

export async function rateBookingByDriverAction({
  data,
}: {
  data: RateBookingByDriverType
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.DRIVER ||
    currentUser.userId !== data.userId ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const updatedBooking = await bookingServices.changeBookingRatingByDriver(data)
  if (!updatedBooking) {
    return
  }
  return updatedBooking
}
