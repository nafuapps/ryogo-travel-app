"use server"

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  CreateNewBookingRequestType,
  CreateNewBookingResponseType,
} from "@ryogo-travel-app/api/types/booking.types"

export async function newBookingAction(data: CreateNewBookingRequestType) {
  const booking: CreateNewBookingResponseType =
    await bookingServices.addNewBooking(data)
  return booking
}
