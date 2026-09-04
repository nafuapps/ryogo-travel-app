"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changePickupAddressAction(
  bookingId: string,
  agencyId: string,
  assignedUserId: string,
  pickupAddress: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      assignedUserId !== currentUser.userId) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const updatedBooking = await bookingServices.changePickupAddress(
    bookingId,
    pickupAddress,
  )
  if (!updatedBooking) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingId,
    isFeed: true,
    textKey: "PickupAddressChanged",
    textObject: {
      bookingId: bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${bookingId}`,
  })

  return updatedBooking
}
