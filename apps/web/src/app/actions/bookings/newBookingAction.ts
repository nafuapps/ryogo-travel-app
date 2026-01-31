"use server"

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { CreateNewBookingRequestType } from "@ryogo-travel-app/api/types/booking.types"

export async function newBookingAction(data: CreateNewBookingRequestType) {
  const booking = await bookingServices.addNewBooking(data)
  if (!booking) return false
  return booking
}
