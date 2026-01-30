"use server"

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export async function assignUserAction(
  bookingId: string,
  selectedUserId: string
) {
  const assignedUser = await bookingServices.assignUserToBooking(
    bookingId,
    selectedUserId
  )
  if (!assignedUser) {
    return false
  }
  return true
}
