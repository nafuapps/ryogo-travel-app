"use server"

import getLeadQuotePDF from "@/components/pdf/getLeadQuotePDF"
import { getCurrentUser } from "@/lib/auth"
import { generateBookingQuoteName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadPDFBlob } from "@ryogo-travel-app/db/storage"

export async function sendQuoteAction(
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

  //Get lead booking details
  const bookingDetails = await bookingServices.findLeadBookingById(id)
  if (!bookingDetails) return

  let quoteUrl = bookingDetails.quoteUrl

  if (!quoteUrl) {
    //If no url, generate quote pdf file
    const quoteFile = await getLeadQuotePDF(bookingDetails)

    //Upload file and get storage url
    quoteUrl = (await uploadPDFBlob(quoteFile, generateBookingQuoteName(id)))
      .path

    //Update quote url in DB
    await bookingServices.addQuoteUrl(id, quoteUrl)
  } else {
    //Else, just update quote sent time
    await bookingServices.changeQuoteSent(id)
  }

  //TODO: Send quote pdf to customer over whatsapp

  return quoteUrl
}
