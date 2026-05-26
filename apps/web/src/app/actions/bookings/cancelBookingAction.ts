"use server"

import getCancellationMessage from "@/components/whatsapp/getCancellationMessage"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function cancelBookingAction(
  id: string,
  agencyId: string,
  assignedUserId: string,
  isConfirmedBooking?: boolean,
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

  const canceledBooking = await bookingServices.cancelBooking(id)
  if (!canceledBooking) return

  if (isConfirmedBooking) {
    await notificationServices.addNotification({
      agencyId: agencyId,
      entityType: EntityTypeEnum.BOOKING,
      entityId: id,
      isFeed: true,
      textKey: "CancelBooking",
      textObject: {
        bookingId: id,
        userName: currentUser.name,
      },
      link: `/dashboard/bookings/${id}`,
    })
  }

  if (isConfirmedBooking) {
    const bookingDetails = await bookingServices.findBookingDetailsById(id)
    if (!bookingDetails) return

    //Send booking cancellation pdf to customer over whatsapp
    const cancelMessage = await getCancellationMessage(
      bookingDetails.customer.phone,
      bookingDetails.customer.name,
      bookingDetails.id,
      bookingDetails.source.city,
      bookingDetails.destination.city,
      bookingDetails.startDate.toLocaleDateString(),
      bookingDetails.assignedUser.phone,
    )
    return cancelMessage
  }

  return canceledBooking
}
