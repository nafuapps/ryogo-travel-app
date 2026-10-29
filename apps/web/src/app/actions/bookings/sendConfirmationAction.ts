"use server"

import sendBookingConfirmationEmail from "@/components/email/sendBookingConfirmationEmail"
import getBookingConfirmationPDF from "@/components/pdf/getBookingConfirmationPDF"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { writePermissions } from "@/lib/permissions"
import { generateBookingConfirmationPathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
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
    !bookingDetails.startTime ||
    bookingDetails.status !== BookingStatusEnum.CONFIRMED
  )
    return

  let confirmationUrl = bookingDetails.confirmationUrl
  const fileName = generateBookingConfirmationPathName(bookingId)

  if (!confirmationUrl) {
    //If no url, generate confirmation pdf file
    const confirmationFile = await getBookingConfirmationPDF(bookingDetails)

    //Upload file and get storage url
    confirmationUrl = (await uploadFile(confirmationFile, fileName)).path
    if (!confirmationUrl) return

    //Update confirmation url in DB
    await bookingServices.addBookingConfirmationSent({
      bookingId,
      confirmationUrl,
    })
  } else {
    //Else, just update confirmation sent time
    await bookingServices.addBookingConfirmationSent({ bookingId })
  }

  //Share confirmation pdf over email to customer
  await sendBookingConfirmationEmail({
    bookingDetails,
    url: getFileUrl(confirmationUrl),
    fileName,
  })

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
