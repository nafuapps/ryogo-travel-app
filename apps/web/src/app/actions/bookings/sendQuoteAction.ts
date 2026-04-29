"use server"

import getQuotePDF from "@/components/pdf/getQuotePDF"
import { getCurrentUser } from "@/lib/auth"
import { generateBookingQuoteName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadPDFBlob } from "@ryogo-travel-app/db/storage"

export async function sendQuoteAction(
  id: string,
  agencyId: string,
  assignedUserId: string,
  generateQuote: boolean,
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

  if (!generateQuote) {
    //TODO: Send quote to customer over whatsapp
    //Update quote sent in DB
    return await bookingServices.sendQuote(id)
  }

  //Get lead booking details
  const bookingDetails = await bookingServices.findLeadBookingById(id)
  if (!bookingDetails) return

  //Generate quote pdf file
  const quoteFile = await getQuotePDF(bookingDetails)

  //Upload file and get storage url
  const quoteUrl = await uploadPDFBlob(quoteFile, generateBookingQuoteName(id))

  //TODO: Send quote to customer over whatsapp
  return await bookingServices.addQuote(id, quoteUrl.path)
}
