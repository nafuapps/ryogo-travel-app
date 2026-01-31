"use server"

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export async function cancelBookingAction(id: string) {
  const canceledBooking = await bookingServices.cancelBooking(id)
  if (!canceledBooking) return false
  return true
}
