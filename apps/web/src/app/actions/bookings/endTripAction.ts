"use server"
import { EndTripBookingEmailTemplate } from "@/components/email/endTripBookingEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import getBookingInvoicePDF from "@/components/pdf/getBookingInvoicePDF"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import {
  generateBookingInvoicePathName,
  generateTripLogPhotoPathName,
} from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { tripLogServices } from "@ryogo-travel-app/api/services/tripLog.services"
import { AddTripLogRequestType } from "@ryogo-travel-app/api/types/tripLog.types"
import {
  EntityTypeEnum,
  TripLogTypesEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import {
  getFileUrl,
  uploadFile,
  uploadPDFBlob,
} from "@ryogo-travel-app/db/storage"

export async function endTripAction(
  data: AddTripLogRequestType,
  customerId: string,
  customerRatingData?: number,
  bookingRatingData?: number,
  customerEmail?: string | null,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.DRIVER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  // Create End Trip Log
  const newTripLog = await tripLogServices.addTripLog({
    driverId: data.driverId,
    bookingId: data.bookingId,
    vehicleId: data.vehicleId,
    agencyId: data.agencyId,
    odometerReading: data.odometerReading,
    type: TripLogTypesEnum.ENDED,
    remarks: data.remarks,
    lat: data.lat,
    long: data.long,
  })
  if (!newTripLog) return

  //Upload triplog photo if attached
  if (data.tripLogPhoto && data.tripLogPhoto[0]) {
    const uploadedFile = await uploadFile(
      data.tripLogPhoto[0],
      generateTripLogPhotoPathName(
        data.bookingId,
        newTripLog.id,
        data.tripLogPhoto[0],
      ),
    )
    await tripLogServices.changeTripLogPhotoUrl(
      newTripLog.id,
      uploadedFile.path,
    )
  }

  //Change Booking, Driver and vehicle status to Completed
  const bookingChanged = await bookingServices.changeBookingToCompleted(
    data.bookingId,
    data.driverId,
    data.vehicleId,
    customerId,
    customerRatingData,
    bookingRatingData,
  )
  if (!bookingChanged) return

  //Update final total price and other values based on trip logs
  await bookingServices.updateBookingCompletedValues(data.bookingId)

  if (customerEmail) {
    //Generate and upload invoice
    const bookingDetails = await bookingServices.findBookingDetailsById(
      data.bookingId,
    )
    if (!bookingDetails) return

    const invoiceFile = await getBookingInvoicePDF(bookingDetails)

    //Upload file and get storage url
    const invoiceUrl = (
      await uploadPDFBlob(
        invoiceFile,
        generateBookingInvoicePathName(data.bookingId),
      )
    ).path
    if (!invoiceUrl) return

    //Update invoice url in DB
    await bookingServices.addInvoiceUrl(data.bookingId, invoiceUrl)

    //Share invoice over email with customer
    sendEmail({
      receipientEmail: [customerEmail],
      subject: "Booking Compeleted - Invoice | RyoGo",
      element: EndTripBookingEmailTemplate({
        name: bookingChanged.customer.name,
        bookingId: bookingChanged.id,
        downloadUrl: getFileUrl(invoiceUrl),
        route: `${bookingChanged.source.city} - ${bookingChanged.destination.city}`,
      }),
    })
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingChanged.id,
    isFeed: true,
    textKey: "TripEnded",
    textObject: {
      bookingId: bookingChanged.id,
      driverName: bookingChanged.driverName,
      vehicleNumber: bookingChanged.vehicleNumber,
    },
    link: `/dashboard/bookings/${bookingChanged.id}`,
  })

  await missionServices.addMission({
    agencyId: data.agencyId,
    userId: bookingChanged.assignedUserId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingChanged.id,
    titleKey: "TripEnded.Title",
    titleObject: {
      bookingId: bookingChanged.id,
      driverName: bookingChanged.driverName,
    },
    messageKey: "TripEnded.Message",
    isCritical: true,
    link: `/rider/myBookings/${bookingChanged.id}`,
  })

  return newTripLog
}
