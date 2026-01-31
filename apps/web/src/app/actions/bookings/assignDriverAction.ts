"use server"

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export async function assignDriverAction(
  bookingId: string,
  selectedDriverId: string,
) {
  const assignedDriver = await bookingServices.assignDriverToBooking(
    bookingId,
    selectedDriverId,
  )
  if (!assignedDriver || !assignedDriver.assignedDriverId) {
    return false
  }
  return assignedDriver
}
