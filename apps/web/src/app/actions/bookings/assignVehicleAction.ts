"use server"

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export async function assignVehicleAction(
  bookingId: string,
  selectedVehicleId: string,
) {
  const assignedVehicle = await bookingServices.assignVehicleToBooking(
    bookingId,
    selectedVehicleId,
  )
  if (!assignedVehicle || !assignedVehicle.assignedVehicleId) {
    return false
  }
  return assignedVehicle
}
