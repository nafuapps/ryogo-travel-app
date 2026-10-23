"use server"

import { writePermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function changeStartTimeAction({
  bookingId,
  agencyId,
  assignedUserId,
  startTime,
}: {
  bookingId: string
  agencyId: string
  assignedUserId: string
  startTime: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId,
    assignedUserId,
  })
  if (!currentUser) {
    return
  }

  const updatedBooking = await bookingServices.changeStartTime(
    bookingId,
    startTime,
  )
  if (!updatedBooking) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingId,
    isFeed: true,
    textKey: "StartTimeChanged",
    textObject: {
      bookingId: bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${bookingId}`,
  })

  return updatedBooking
}
