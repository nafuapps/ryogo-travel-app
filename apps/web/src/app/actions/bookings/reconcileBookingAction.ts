"use server"

import { writePermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function reconcileBookingAction({
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

  const updatedBooking = await bookingServices.reconcileBooking(bookingId)
  if (!updatedBooking) {
    return
  }

  //Add notification
  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: updatedBooking.id,
    isFeed: true,
    textKey: "BookingReconciled",
    textObject: {
      bookingId: updatedBooking.id,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${updatedBooking.id}`,
  })

  return updatedBooking
}
