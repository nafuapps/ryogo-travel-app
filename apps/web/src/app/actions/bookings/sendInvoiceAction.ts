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
  generateInvoice: boolean,
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

  if (!generateInvoice) {
    //TODO: Send invoice to customer over whatsapp
    //Update invoice sent in DB
    return await bookingServices.sendInvoice(id)
  }

  //Get booking details
  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails) return

  //Generate invoice pdf file
  const invoiceFile = await getInvoicePDF(bookingDetails)

  //Upload file and get storage url
  const invoiceUrl = await uploadPDFBlob(
    invoiceFile,
    generateBookingInvoiceName(id),
  )

  //TODO: Send invoice to customer over whatsapp

  //Update invoice url in DB
  return await bookingServices.addInvoice(id, invoiceUrl.path)
}
