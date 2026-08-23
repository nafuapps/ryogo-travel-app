"use server"

import { BookingCompletedInvoiceEmailTemplate } from "@/components/email/bookingCompletedInvoiceEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import getBookingInvoicePDF from "@/components/pdf/getBookingInvoicePDF"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateBookingInvoicePathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadPDFBlob } from "@ryogo-travel-app/db/storage"

export async function reviewCompletedBookingAction(
  bookingId: string,
  agencyId: string,
  userId: string,
  customerEmail?: string | null,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== userId) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (!bookingDetails) return

  const updatedBooking = await bookingServices.changeReviewedByAgency(bookingId)
  if (!updatedBooking) {
    return
  }

  //Generate invoice pdf
  const invoiceFile = await getBookingInvoicePDF(bookingDetails)

  //Upload file and get storage url
  const invoiceUrl = (
    await uploadPDFBlob(invoiceFile, generateBookingInvoicePathName(bookingId))
  ).path
  if (!invoiceUrl) return

  //Update invoice url in DB
  await bookingServices.addInvoiceUrl(bookingId, invoiceUrl)

  if (customerEmail) {
    //Send invoice over email to the customer
    sendEmail({
      receipientEmail: [customerEmail],
      subject: "Booking Completed - Invoice | RyoGo",
      element: BookingCompletedInvoiceEmailTemplate({
        name: bookingDetails.customer.name,
        bookingId: bookingDetails.id,
        downloadUrl: getFileUrl(invoiceUrl),
        route: `${bookingDetails.source.city} - ${bookingDetails.destination.city}`,
      }),
    })
  }

  //Remove trip ended mission
  await missionServices.removePreviousMissionsByEntityKey(
    agencyId,
    EntityTypeEnum.BOOKING,
    updatedBooking.id,
    "TripEnded.Title",
  )

  return updatedBooking
}
