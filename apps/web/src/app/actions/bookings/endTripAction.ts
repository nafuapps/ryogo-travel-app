"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateTripLogPhotoPathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { tripLogServices } from "@ryogo-travel-app/api/services/tripLog.services"
import { AddTripLogRequestType } from "@ryogo-travel-app/api/types/tripLog.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function endTripAction({
  data,
  customerId,
  customerRatingData,
  bookingRatingData,
}: {
  data: AddTripLogRequestType
  customerId: string
  customerRatingData?: number
  bookingRatingData?: number
}) {
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
  const newTripLog = await tripLogServices.addTripLog(data)
  if (!newTripLog) return

  //Upload triplog photo if attached
  const [tripLogPhotoFile] = data.tripLogPhoto || []
  if (tripLogPhotoFile) {
    const uploadedFile = await uploadFile(
      tripLogPhotoFile,
      generateTripLogPhotoPathName(
        data.bookingId,
        newTripLog.id,
        tripLogPhotoFile,
      ),
    )
    await tripLogServices.changeTripLogPhotoUrl({
      tripLogId: newTripLog.id,
      tripLogPhotoUrl: uploadedFile.path,
    })
  }

  //Change Booking, Driver and vehicle status to Completed
  const bookingChanged = await bookingServices.changeBookingToCompleted({
    bookingId: data.bookingId,
    driverId: data.driverId,
    vehicleId: data.vehicleId,
    customerId,
    customerRatingByDriver: customerRatingData,
    bookingRatingByDriver: bookingRatingData,
  })
  if (!bookingChanged) return

  //Update actual total price and other values based on trip logs
  await bookingServices.updateBookingActualValues(data.bookingId)

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
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
    },
    messageKey: "TripEnded.Message",
    messageObject: {
      driverName: bookingChanged.driverName,
    },
    isCritical: true,
    link: `/rider/myBookings/${bookingChanged.id}`,
  })

  //Remove trip started mission
  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingChanged.id,
    titleKey: "TripStarted.Title",
  })

  return newTripLog
}
