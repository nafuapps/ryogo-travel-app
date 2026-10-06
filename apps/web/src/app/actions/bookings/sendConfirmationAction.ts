"use server"

import getBookingConfirmationPDF from "@/components/pdf/getBookingConfirmationPDF"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateBookingConfirmationPathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadFile } from "@ryogo-travel-app/db/storage"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"

export async function sendConfirmationAction({
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

  //Get lead booking details
  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (!bookingDetails || !bookingDetails.startTime) return

  let confirmationUrl = bookingDetails.confirmationUrl

  if (!confirmationUrl) {
    //If no url, generate confirmation pdf file
    const confirmationFile = await getBookingConfirmationPDF(bookingDetails)

    //Upload file and get storage url
    confirmationUrl = (
      await uploadFile(
        confirmationFile,
        generateBookingConfirmationPathName(bookingId),
      )
    ).path
    if (!confirmationUrl) return

    //Update confirmation url in DB
    await bookingServices.addConfirmationUrl({ bookingId, confirmationUrl })
  } else {
    //Else, just update confirmation sent time
    await bookingServices.changeConfirmationSent(bookingId)
  }

  //Send confirmation pdf to customer over whatsapp
  const t = await getTranslations("Dashboard.Whatsapp")
  let message
  const messageBody = {
    customerName: bookingDetails.customer.name,
    bookingId: bookingDetails.id,
    source: bookingDetails.source.city,
    destination: bookingDetails.destination.city,
    startDate: format(bookingDetails.startDate, "dd MMM"),
    startTime: bookingDetails.startTime,
    agencyPhone: bookingDetails.assignedUser.phone,
    confirmationLink: getFileUrl(confirmationUrl),
  }

  if (!bookingDetails.assignedDriver || !bookingDetails.assignedVehicle) {
    message = t("ConfirmationWithoutDriverVehicle", messageBody)
  } else {
    message = t("Confirmation", {
      ...messageBody,
      driverName: bookingDetails.assignedDriver.name,
      vehicleNumber: bookingDetails.assignedVehicle.vehicleNumber,
    })
  }

  const confirmationMessage = getWhatsappMessageLink(
    bookingDetails.customer.phone,
    message,
  )
  return confirmationMessage
}
