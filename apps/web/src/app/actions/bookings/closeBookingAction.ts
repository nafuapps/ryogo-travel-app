"use server"

import sendBookingInvoiceEmail from "@/components/email/sendBookingInvoiceEmail"
import getBookingInvoicePDF from "@/components/pdf/getBookingInvoicePDF"
import { writePermissions } from "@/lib/permissions"
import { generateBookingInvoicePathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { BookingStatusEnum, EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadFile } from "@ryogo-travel-app/db/storage"

export async function closeBookingAction({
  bookingId,
  agencyId,
  assignedUserId,
}: {
  bookingId: string
  agencyId: string
  assignedUserId: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId,
    assignedUserId,
  })
  if (!currentUser) {
    return
  }

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (
    !bookingDetails ||
    bookingDetails.status !== BookingStatusEnum.COMPLETED ||
    bookingDetails.closedAt
  )
    return

  const updatedBooking = await bookingServices.closeBooking(bookingId)
  if (!updatedBooking) {
    return
  }

  //Generate and store invoice pdf
  const invoiceFile = await getBookingInvoicePDF(bookingDetails)
  const fileName = generateBookingInvoicePathName(bookingId)
  const invoiceUrl = (await uploadFile(invoiceFile, fileName)).path
  await bookingServices.addBookingInvoiceSent({ bookingId, invoiceUrl })

  //Send invoice pdf over email to customer
  const result = await sendBookingInvoiceEmail({
    bookingDetails,
    url: getFileUrl(invoiceUrl),
    fileName,
  })
  if (result && result.data) {
    await bookingServices.changeSecretCodeSentOn(bookingId)
  }

  //Add notification
  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: updatedBooking.id,
    isFeed: true,
    textKey: "BookingClosed",
    textObject: {
      bookingId: updatedBooking.id,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${updatedBooking.id}`,
  })

  //Remove trip ended mission
  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: updatedBooking.id,
    titleKey: "TripEnded.Title",
  })

  return updatedBooking
}
