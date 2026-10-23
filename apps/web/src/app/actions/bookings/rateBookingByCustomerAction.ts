"use server"
import { readPermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { RateBookingByCustomerType } from "@ryogo-travel-app/api/types/booking.types"

export async function rateBookingByCustomerAction({
  data,
}: {
  data: RateBookingByCustomerType
}) {
  await readPermissions.redirectIfAuthenticated()

  const updatedBooking =
    await bookingServices.changeBookingRatingByCustomer(data)
  if (!updatedBooking) {
    return
  }
  return updatedBooking
}
