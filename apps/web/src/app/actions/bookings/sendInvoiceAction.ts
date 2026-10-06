"use server"

import getBookingInvoicePDF from "@/components/pdf/getBookingInvoicePDF"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateBookingInvoicePathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
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

  //Get booking details
  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (!bookingDetails) return

  let invoiceUrl = bookingDetails.invoiceUrl

  if (!invoiceUrl) {
    //If no invoice url exists, generate invoice pdf file
    const invoiceFile = await getBookingInvoicePDF(bookingDetails)

    //Upload file and get storage url
    invoiceUrl = (
      await uploadFile(invoiceFile, generateBookingInvoicePathName(bookingId))
    ).path
    if (!invoiceUrl) return

    //Update invoice url in DB
    await bookingServices.addInvoiceUrl({ bookingId, invoiceUrl })
  } else {
    //Else, just update invoice sent time
    await bookingServices.changeInvoiceSent(bookingId)
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
