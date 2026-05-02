"use server"

import getBookingConfirmationPDF from "@/components/pdf/getBookingConfirmationPDF"
import getConfirmationMessage from "@/components/whatsapp/getConfirmationMessage"
import { getCurrentUser } from "@/lib/auth"
import { generateBookingConfirmationName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadPDFBlob } from "@ryogo-travel-app/db/storage"

export async function confirmBookingAction(
  id: string,
  agencyId: string,
  assignedUserId: string,
  startTime: string,
  pickupAddress: string,
  dropAddress?: string,
  updateCustomerAddress?: boolean,
  customerId?: string,
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

  const confirmedBooking = await bookingServices.confirmBooking(
    id,
    startTime,
    pickupAddress,
    dropAddress,
    updateCustomerAddress,
    customerId,
  )
  if (!confirmedBooking) return

  //Get booking details
  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails || !bookingDetails.startTime) {
    return
  }

  //Generate confirmation pdf file
  const confirmationFile = await getBookingConfirmationPDF(bookingDetails)

  //Upload file and get storage url
  const confirmationUrl = (
    await uploadPDFBlob(confirmationFile, generateBookingConfirmationName(id))
  ).path

  if (!confirmationUrl) return

  //Send booking confirmation pdf to customer over whatsapp
  const confirmationMessage = await getConfirmationMessage(
    bookingDetails.customer.phone,
    bookingDetails.customer.name,
    bookingDetails.id,
    bookingDetails.source.city,
    bookingDetails.destination.city,
    bookingDetails.startDate.toLocaleDateString(),
    bookingDetails.startTime,
    bookingDetails.assignedUser.phone,
    getFileUrl(confirmationUrl),
    bookingDetails.assignedDriver?.name,
    bookingDetails.assignedVehicle?.vehicleNumber,
  )
  return confirmationMessage
}
