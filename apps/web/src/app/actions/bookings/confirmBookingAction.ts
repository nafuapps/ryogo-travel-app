"use server"

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export async function confirmBookingAction(
  id: string,
  startTime?: string,
  pickupAddress?: string,
  dropAddress?: string,
  updateCustomerAddress?: boolean,
  customerId?: string,
) {
  const confirmedBooking = await bookingServices.confirmBooking(
    id,
    startTime,
    pickupAddress,
    dropAddress,
    updateCustomerAddress,
    customerId,
  )
  if (!confirmedBooking) return false
  return confirmedBooking
}
