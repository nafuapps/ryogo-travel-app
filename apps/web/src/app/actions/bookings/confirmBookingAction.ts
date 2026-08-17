"use server"

import { ConfirmBookingEmailTemplate } from "@/components/email/confirmBookingEmailTemplate copy"
import sendEmail from "@/components/email/sendEmail"
import getBookingConfirmationPDF from "@/components/pdf/getBookingConfirmationPDF"
import getConfirmationMessageLink from "@/components/whatsapp/getConfirmationMessageLink"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateBookingConfirmationPathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadPDFBlob } from "@ryogo-travel-app/db/storage"
import { headers } from "next/headers"

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

  if (!(await verifyCurrentUser())) {
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

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingDetails.id,
    isFeed: true,
    textKey: "ConfirmedBooking",
    textObject: {
      bookingId: bookingDetails.id,
      userName: bookingDetails.assignedUser.name,
    },
    link: `/dashboard/bookings/${bookingDetails.id}`,
  })

  if (bookingDetails.assignedDriver) {
    await missionServices.addMission({
      agencyId: agencyId,
      userId: bookingDetails.assignedDriver.userId,
      entityType: EntityTypeEnum.BOOKING,
      entityId: bookingDetails.id,
      titleKey: "ConfirmedBooking.Title",
      titleObject: { bookingId: bookingDetails.id },
      messageKey: "ConfirmedBooking.Message",
      link: `/rider/myBookings/${bookingDetails.id}`,
    })
  }

  //Generate confirmation pdf file
  const confirmationFile = await getBookingConfirmationPDF(bookingDetails)

  //Upload file and get storage url
  const confirmationUrl = (
    await uploadPDFBlob(
      confirmationFile,
      generateBookingConfirmationPathName(id),
    )
  ).path

  //Update confirmation url in DB
  await bookingServices.addConfirmationUrl(id, confirmationUrl)

  //Share confirmation over email to customer
  if (bookingDetails.customer.email) {
    const headerList = await headers()
    const host = headerList.get("host")
    const protocol = headerList.get("x-forwarded-proto") || "http"
    const trackingUrl = `${protocol}://${host}/track/booking/${bookingDetails.id}`

    sendEmail({
      receipientEmail: [bookingDetails.customer.email],
      subject: "Booking Confirmation | RyoGo",
      element: ConfirmBookingEmailTemplate({
        name: bookingDetails.customer.name,
        bookingId: bookingDetails.id,
        downloadUrl: getFileUrl(confirmationUrl),
        trackingUrl: trackingUrl,
        route: `${bookingDetails.source.city} - ${bookingDetails.destination.city}`,
        date: bookingDetails.startDate.toLocaleDateString(),
        assignedDriver: bookingDetails.assignedDriver?.name,
        assignedVehicle: bookingDetails.assignedVehicle?.vehicleNumber,
      }),
    })
  }

  //Get booking confirmation pdf link so that it can be shared to customer over whatsapp
  const confirmationMessage = await getConfirmationMessageLink(
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
