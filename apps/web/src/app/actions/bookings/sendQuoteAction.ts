"use server"

import getLeadQuotePDF from "@/components/pdf/getLeadQuotePDF"
import getQuoteMessage from "@/components/whatsapp/getQuoteMessage"
import { getCurrentUser } from "@/lib/auth"
import { generateBookingQuoteName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadPDFBlob } from "@ryogo-travel-app/db/storage"

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
    if (!quoteUrl) return

    //Update quote url in DB
    await bookingServices.addQuoteUrl(id, quoteUrl)
  } else {
    //Else, just update quote sent time in DB
    await bookingServices.changeQuoteSent(id)
  }

  //Send quote pdf to customer over whatsapp
  const quoteMessage = await getQuoteMessage(
    bookingDetails.customer.phone,
    bookingDetails.customer.name,
    bookingDetails.id,
    bookingDetails.source.city,
    bookingDetails.destination.city,
    bookingDetails.totalAmount.toString(),
    bookingDetails.startDate.toLocaleDateString(),
    bookingDetails.assignedUser.phone,
    getFileUrl(quoteUrl),
  )

  return quoteMessage
}
