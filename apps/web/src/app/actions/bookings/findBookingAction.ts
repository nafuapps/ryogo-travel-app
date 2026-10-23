"use server"

import { readPermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export async function findBookingAction(bookingId: string) {
  await readPermissions.redirectIfAuthenticated()

  const bookingDetails = await bookingServices.findBookingStatusById(bookingId)
  if (!bookingDetails || bookingDetails.status === BookingStatusEnum.LEAD) {
    return
  }

  return bookingDetails
}
