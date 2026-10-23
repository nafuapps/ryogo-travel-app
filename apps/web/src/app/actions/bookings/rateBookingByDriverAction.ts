"use server"

import { writePermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { RateBookingByDriverType } from "@ryogo-travel-app/api/types/booking.types"

export async function rateBookingByDriverAction({
  data,
}: {
  data: RateBookingByDriverType
}) {
  const currentUser = await writePermissions.allowAssignedDriver({
    agencyId: data.agencyId,
    assignedDriverUserId: data.userId,
  })
  if (!currentUser) {
    return
  }

  const updatedBooking = await bookingServices.changeBookingRatingByDriver(data)
  if (!updatedBooking) {
    return
  }
  return updatedBooking
}
