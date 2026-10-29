"use server"

import sendBookingQuoteEmail from "@/components/email/sendBookingQuoteEmail"
import getLeadQuotePDF from "@/components/pdf/getLeadQuotePDF"
import { writePermissions } from "@/lib/permissions"
import { generateBookingQuotePathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import { BookingStatusEnum, EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadFile } from "@ryogo-travel-app/db/storage"

export async function newBookingAction({
  data,
}: {
  data: NewBookingRequestDataType
}) {
  const currentUser = await writePermissions.allowDashboardUser(data.agencyId)
  if (!currentUser) {
    return
  }

  const booking = await bookingServices.addNewBooking(data)
  if (!booking) {
    return
  }

  const bookingDetails = await bookingServices.findBookingDetailsById(
    booking.id,
  )
  if (!bookingDetails || bookingDetails.status !== BookingStatusEnum.LEAD) {
    return
  }

  //Generate and upload quote
  const quoteFile = await getLeadQuotePDF(bookingDetails)
  const fileName = generateBookingQuotePathName(bookingDetails.id)

  const quoteUrl = (await uploadFile(quoteFile, fileName)).path

  //Update quote url in DB
  await bookingServices.addBookingQuoteSent({
    bookingId: bookingDetails.id,
    quoteUrl,
  })

  // Share quote pdf over email to customer
  await sendBookingQuoteEmail({
    bookingDetails,
    url: getFileUrl(quoteUrl),
    fileName,
  })

  //Add mission to confirm this new booking
  await missionServices.addMission({
    agencyId: data.agencyId,
    userId: booking.assignedUserId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: booking.id,
    dueDate: data.startDate,
    isCritical: true,
    titleKey: "LeadBooking.Title",
    titleObject: { bookingId: booking.id },
    messageKey: "LeadBooking.Message",
    link: `/dashboard/bookings/${booking.id}`,
  })

  //Add notification
  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: booking.id,
    isFeed: true,
    textKey: "LeadBooking",
    textObject: {
      bookingId: booking.id,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${booking.id}`,
  })

  return booking
}
