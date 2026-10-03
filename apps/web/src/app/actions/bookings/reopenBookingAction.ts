"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function reopenBookingAction(bookingId: string, agencyId: string) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const updatedBooking = await bookingServices.reopenBooking(bookingId)
  if (!updatedBooking) {
    return
  }

  //Remove previous notification
  await notificationServices.removeNotificationByEntityAndKey(
    agencyId,
    updatedBooking.id,
    "BookingClosed",
  )

  return updatedBooking
}
