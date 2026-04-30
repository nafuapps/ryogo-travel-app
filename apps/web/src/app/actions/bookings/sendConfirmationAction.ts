"use server"

import getBookingConfirmationPDF from "@/components/pdf/getBookingConfirmationPDF"
import { getCurrentUser } from "@/lib/auth"
import { generateBookingConfirmationName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadPDFBlob } from "@ryogo-travel-app/db/storage"

export async function sendConfirmationAction(
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
  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails) return

  let confirmationUrl = bookingDetails.confirmationUrl

  if (!confirmationUrl) {
    //If no url, generate confirmation pdf file
    const confirmationFile = await getBookingConfirmationPDF(bookingDetails)

    //Upload file and get storage url
    confirmationUrl = (
      await uploadPDFBlob(confirmationFile, generateBookingConfirmationName(id))
    ).path

    //Update confirmation url in DB
    await bookingServices.addConfirmationUrl(id, confirmationUrl)
  } else {
    //Else, just update confirmation sent time
    await bookingServices.changeConfirmationSent(id)
  }

  //TODO: Send confirmation pdf to customer over whatsapp

  return confirmationUrl
}
