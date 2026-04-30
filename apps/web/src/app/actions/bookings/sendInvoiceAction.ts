"use server"

import getInvoicePDF from "@/components/pdf/getInvoicePDF"
import { getCurrentUser } from "@/lib/auth"
import { generateBookingInvoiceName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadPDFBlob } from "@ryogo-travel-app/db/storage"

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

  //Get booking details
  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails) return

  let invoiceUrl = bookingDetails.invoiceUrl

  if (!invoiceUrl) {
    //If no invoice url exists, generate invoice pdf file
    const invoiceFile = await getInvoicePDF(bookingDetails)

    //Upload file and get storage url
    invoiceUrl = (
      await uploadPDFBlob(invoiceFile, generateBookingInvoiceName(id))
    ).path

    //Update invoice url in DB
    await bookingServices.addInvoiceUrl(id, invoiceUrl)
  } else {
    //Else, just update invoice sent time
    await bookingServices.changeInvoiceSent(id)
  }

  //TODO: Send invoice pdf to customer over whatsapp

  return invoiceUrl
}
