"use server"

import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"

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

  if (!(await verifyCurrentUser())) {
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
    const t = await getTranslations("Dashboard.Whatsapp")
    const message = t("Cancellation", {
      customerName: bookingDetails.customer.name,
      bookingId: bookingDetails.id,
      source: bookingDetails.source.city,
      destination: bookingDetails.destination.city,
      startDate: bookingDetails.startDate.toLocaleDateString(),
      agencyPhone: bookingDetails.assignedUser.phone,
    })
    const cancelMessage = getWhatsappMessageLink(
      bookingDetails.customer.phone,
      message,
    )
    return cancelMessage
  }

  return canceledBooking
}
