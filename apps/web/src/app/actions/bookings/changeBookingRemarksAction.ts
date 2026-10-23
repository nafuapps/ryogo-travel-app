"use server"

import { writePermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function changeBookingRemarksAction({
  bookingId,
  agencyId,
  assignedUserId,
  bookingRemarks,
}: {
  bookingId: string
  agencyId: string
  assignedUserId: string
  bookingRemarks: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId,
    assignedUserId,
  })
  if (!currentUser) {
    return
  }

  const updatedBooking = await bookingServices.changeBookingRemarks(
    bookingId,
    bookingRemarks,
  )
  if (!updatedBooking) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingId,
    isFeed: true,
    textKey: "BookingRemarksChanged",
    textObject: {
      bookingId: bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${bookingId}`,
  })

  return updatedBooking
}
