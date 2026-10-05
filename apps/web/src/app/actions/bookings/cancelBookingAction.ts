"use server"

import { CancelBookingEmailTemplate } from "@/components/email/cancelBookingEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import {
  BookingStatusEnum,
  EntityTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"

export async function cancelBookingAction(
  bookingId: string,
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

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (!bookingDetails) return

  const canceledBooking = await bookingServices.cancelBooking(bookingId)
  if (!canceledBooking) return

  //Remove any missions for this booking
  await missionServices.removePreviousMissionsByEntityId(agencyId, bookingId)

  if (isCancelledByUser) {
    //Add a notification feed
    await notificationServices.addNotification({
      agencyId: agencyId,
      userId: currentUser.userId,
      entityType: EntityTypeEnum.BOOKING,
      entityId: bookingId,
      isFeed: true,
      textKey: "CancelBooking",
      textObject: {
        bookingId: bookingId,
        userName: currentUser.name,
      },
      link: `/dashboard/bookings/${bookingId}`,
    })

    if (bookingDetails.status === BookingStatusEnum.CONFIRMED) {
      //Send booking cancellation email to customer
      if (bookingDetails.customer.email) {
        await sendEmail({
          receipientEmail: [bookingDetails.customer.email],
          subject: "Booking Cancellation | RyoGo",
          element: CancelBookingEmailTemplate({
            name: bookingDetails.customer.name,
            bookingId: bookingDetails.id,
            route: `${bookingDetails.source.city} - ${bookingDetails.destination.city}`,
            date: format(bookingDetails.startDate, "dd MMM"),
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
        startDate: format(bookingDetails.startDate, "dd MMM"),
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

  redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
}
