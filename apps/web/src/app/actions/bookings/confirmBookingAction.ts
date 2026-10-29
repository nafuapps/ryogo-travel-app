"use server"

import sendBookingConfirmationEmail from "@/components/email/sendBookingConfirmationEmail"
import getBookingConfirmationPDF from "@/components/pdf/getBookingConfirmationPDF"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { writePermissions } from "@/lib/permissions"
import { generateBookingConfirmationPathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ConfirmBookingRequestType } from "@ryogo-travel-app/api/types/booking.types"
import { BookingStatusEnum, EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadFile } from "@ryogo-travel-app/db/storage"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"

export async function confirmBookingAction({
  data,
}: {
  data: ConfirmBookingRequestType
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: data.agencyId,
    assignedUserId: data.assignedUserId,
  })
  if (!currentUser) {
    return
  }

  const confirmedBooking = await bookingServices.confirmBooking(data)
  if (!confirmedBooking) return

  //Get booking details
  const bookingDetails = await bookingServices.findBookingDetailsById(
    data.bookingId,
  )
  if (
    !bookingDetails ||
    !bookingDetails.startTime ||
    bookingDetails.status !== BookingStatusEnum.CONFIRMED
  ) {
    return
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
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

  //Remove lead mission for this booking
  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingDetails.id,
    titleKey: "LeadBooking.Title",
  })

  if (bookingDetails.assignedDriver) {
    await missionServices.addMission({
      agencyId: data.agencyId,
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
  const fileName = generateBookingConfirmationPathName(bookingDetails.id)

  //Upload file and get storage url
  const confirmationUrl = (await uploadFile(confirmationFile, fileName)).path

  //Update confirmation url in DB
  await bookingServices.addBookingConfirmationSent({
    bookingId: bookingDetails.id,
    confirmationUrl,
  })

  //Share confirmation pdf over email to customer
  await sendBookingConfirmationEmail({
    bookingDetails,
    url: getFileUrl(confirmationUrl),
    fileName,
  })

  //Get booking confirmation pdf link so that it can be shared with customer over whatsapp
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
