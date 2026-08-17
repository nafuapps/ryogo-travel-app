"use server"

import { LeadBookingEmailTemplate } from "@/components/email/leadBookingEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import getLeadQuotePDF from "@/components/pdf/getLeadQuotePDF"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { OLD_LEAD_AUTO_CANCEL_DAYS } from "@/lib/uiConfig"
import { generateBookingQuotePathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { CreateNewBookingRequestType } from "@ryogo-travel-app/api/types/booking.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadPDFBlob } from "@ryogo-travel-app/db/storage"
import { addDays } from "date-fns"

export async function newBookingAction(data: CreateNewBookingRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== data.userId ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const booking = await bookingServices.addNewBooking(data)
  if (!booking) return

  const leadBooking = await bookingServices.findBookingDetailsById(booking.id)
  if (!leadBooking) return

  if (leadBooking.customer.email) {
    //Generate and upload quote
    const quoteFile = await getLeadQuotePDF(leadBooking)

    const quoteUrl = (
      await uploadPDFBlob(
        quoteFile,
        generateBookingQuotePathName(leadBooking.id),
      )
    ).path
    if (!quoteUrl) return

    //Update quote url in DB
    await bookingServices.addQuoteUrl(leadBooking.id, quoteUrl)

    // Share quote over email to customer
    sendEmail({
      receipientEmail: [leadBooking.customer.email],
      subject: "Booking Quotation | RyoGo",
      element: LeadBookingEmailTemplate({
        name: leadBooking.customer.name,
        bookingId: leadBooking.id,
        downloadUrl: getFileUrl(quoteUrl),
        route: `${leadBooking.source.city} - ${leadBooking.destination.city}`,
        date: leadBooking.startDate.toLocaleDateString(),
      }),
    })
  }

  //Add mission to confirm this new booking
  await missionServices.addMission({
    agencyId: data.agencyId,
    userId: booking.assignedUserId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: booking.id,
    dueDate: addDays(data.tripStartDate, OLD_LEAD_AUTO_CANCEL_DAYS),
    isCritical: true,
    titleKey: "LeadBooking.Title",
    titleObject: { bookingId: booking.id },
    messageKey: "LeadBooking.Message",
    link: `/dashboard/bookings/${booking.id}/confirm`,
  })

  //Add notification
  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: booking.id,
    isFeed: true,
    textKey: "LeadBooking",
    textObject: {
      bookingId: booking.id,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${booking.id}/confirm`,
  })

  return booking
}
