"use server"

import { writePermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"

export async function reopenBookingAction({
  bookingId,
  agencyId,
}: {
  bookingId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) {
    return
  }

  const updatedBooking = await bookingServices.reopenBooking(bookingId)
  if (!updatedBooking) {
    return
  }

  //Remove previous notification
  await notificationServices.removeNotificationByEntityAndKey({
    agencyId,
    entityId: updatedBooking.id,
    textKey: "BookingClosed",
  })

  return updatedBooking
}
