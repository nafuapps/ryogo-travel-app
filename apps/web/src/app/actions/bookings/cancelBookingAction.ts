"use server"

import { CancelBookingEmailTemplate } from "@/components/email/cancelBookingEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import {
  BookingStatusEnum,
  EntityTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"

export async function cancelBookingAction(
  id: string,
  agencyId: string,
  assignedUserId: string,
  isCancelledByUser?: boolean,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.agencyId !== agencyId ||
    (isCancelledByUser &&
      currentUser.userRole !== UserRolesEnum.OWNER &&
      assignedUserId !== currentUser.userId)
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails) return

  const canceledBooking = await bookingServices.cancelBooking(id)
  if (!canceledBooking) return

  if (isCancelledByUser) {
    //Add a notification feed
    await notificationServices.addNotification({
      agencyId: agencyId,
      userId: currentUser.userId,
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

    if (bookingDetails.status === BookingStatusEnum.CONFIRMED) {
      //Send booking cancellation email to customer
      if (bookingDetails.customer.email) {
        sendEmail({
          receipientEmail: [bookingDetails.customer.email],
          subject: "Booking Cancellation | RyoGo",
          element: CancelBookingEmailTemplate({
            name: bookingDetails.customer.name,
            bookingId: bookingDetails.id,
            route: `${bookingDetails.source.city} - ${bookingDetails.destination.city}`,
            date: bookingDetails.startDate.toLocaleDateString(),
          }),
        })
      }

      //Prepare booking cancellation message for sending to customer over whatsapp
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

  redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
}
