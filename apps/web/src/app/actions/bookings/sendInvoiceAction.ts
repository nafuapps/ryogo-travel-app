"use server"

import getBookingInvoicePDF from "@/components/pdf/getBookingInvoicePDF"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateBookingInvoicePathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadPDFBlob } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"

export async function sendInvoiceAction(
  id: string,
  agencyId: string,
  assignedUserId: string,
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

  //Get booking details
  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails) return

  let invoiceUrl = bookingDetails.invoiceUrl

  if (!invoiceUrl) {
    //If no invoice url exists, generate invoice pdf file
    const invoiceFile = await getBookingInvoicePDF(bookingDetails)

    //Upload file and get storage url
    invoiceUrl = (
      await uploadPDFBlob(invoiceFile, generateBookingInvoicePathName(id))
    ).path
    if (!invoiceUrl) return

    //Update invoice url in DB
    await bookingServices.addInvoiceUrl(id, invoiceUrl)
  } else {
    //Else, just update invoice sent time
    await bookingServices.changeInvoiceSent(id)
  }

  // Send invoice pdf to customer over whatsapp
  const t = await getTranslations("Dashboard.Whatsapp")
  const message = t("Invoice", {
    customerName: bookingDetails.customer.name,
    bookingId: bookingDetails.id,
    source: bookingDetails.source.city,
    destination: bookingDetails.destination.city,
    startDate: bookingDetails.startDate.toLocaleDateString(),
    agencyPhone: bookingDetails.assignedUser.phone,
    invoiceLink: getFileUrl(invoiceUrl),
  })
  const invoiceMessage = getWhatsappMessageLink(
    bookingDetails.customer.phone,
    message,
  )

  return invoiceMessage
}
