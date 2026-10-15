"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import {
  BookingStatusEnum,
  EntityTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"

export async function reconcileBookingAction({
  bookingId,
  agencyId,
}: {
  bookingId: string
  agencyId: string
}) {
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

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (
    !bookingDetails ||
    bookingDetails.status !== BookingStatusEnum.COMPLETED ||
    !bookingDetails.closedAt ||
    bookingDetails.reconciledAt
  )
    return

  const updatedBooking = await bookingServices.reconcileBooking(bookingId)
  if (!updatedBooking) {
    return
  }

  //Add notification
  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingDetails.id,
    isFeed: true,
    textKey: "BookingReconciled",
    textObject: {
      bookingId: bookingDetails.id,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${bookingDetails.id}`,
  })

  return updatedBooking
}
