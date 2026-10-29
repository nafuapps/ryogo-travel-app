"use server"

import sendBookingInvoiceEmail from "@/components/email/sendBookingInvoiceEmail"
import getBookingInvoicePDF from "@/components/pdf/getBookingInvoicePDF"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { writePermissions } from "@/lib/permissions"
import { generateBookingInvoicePathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadFile } from "@ryogo-travel-app/db/storage"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"

export async function sendInvoiceAction({
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

  //Get booking details
  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (
    !bookingDetails ||
    bookingDetails.status !== BookingStatusEnum.COMPLETED ||
    !bookingDetails.closedAt
  ) {
    return
  }

  let invoiceUrl = bookingDetails.invoiceUrl
  const fileName = generateBookingInvoicePathName(bookingId)

  if (!invoiceUrl) {
    //If no invoice url exists, generate and store invoice pdf file
    const invoiceFile = await getBookingInvoicePDF(bookingDetails)
    invoiceUrl = (await uploadFile(invoiceFile, fileName)).path
    await bookingServices.addBookingInvoiceSent({ bookingId, invoiceUrl })
  } else {
    //Else, just update invoice sent time
    await bookingServices.addBookingInvoiceSent({ bookingId })
  }

  //Send invoice pdf over email to customer
  const result = await sendBookingInvoiceEmail({
    bookingDetails,
    url: getFileUrl(invoiceUrl),
    fileName,
  })
  if (result && result.data) {
    await bookingServices.changeSecretCodeSentOn(bookingId)
  }

  // Send invoice pdf to customer over whatsapp
  const t = await getTranslations("Dashboard.Whatsapp")
  const message = t("Invoice", {
    customerName: bookingDetails.customer.name,
    bookingId: bookingDetails.id,
    source: bookingDetails.source.city,
    destination: bookingDetails.destination.city,
    startDate: format(bookingDetails.startDate, "dd MMM"),
    agencyPhone: bookingDetails.assignedUser.phone,
    invoiceLink: getFileUrl(invoiceUrl),
  })
  const invoiceMessage = getWhatsappMessageLink(
    bookingDetails.customer.phone,
    message,
  )

  return invoiceMessage
}
