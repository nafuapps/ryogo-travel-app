"use server"
import { getCurrentUser } from "@/lib/auth"
import { generateTripLogPhotoPathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { tripLogServices } from "@ryogo-travel-app/api/services/tripLog.services"
import {
  EntityTypeEnum,
  TripLogTypesEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { AddTripLogRequestType } from "@ryogo-travel-app/api/types/tripLog.types"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"

export async function startTripAction(data: AddTripLogRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.DRIVER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }
  //Change Booking, Driver and vehicle status to In trip
  const bookingChanged = await bookingServices.changeBookingToInProgress(
    data.bookingId,
    data.driverId,
    data.vehicleId,
  )
  if (!bookingChanged) return

  // Create Start Trip Log
  const newTripLog = await tripLogServices.addTripLog({
    driverId: data.driverId,
    bookingId: data.bookingId,
    vehicleId: data.vehicleId,
    agencyId: data.agencyId,
    odometerReading: data.odometerReading,
    type: TripLogTypesEnum.START_TRIP,
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

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingChanged.id,
    isFeed: true,
    textKey: "TripStarted",
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
    titleKey: "TripStarted.Title",
    titleObject: {
      bookingId: bookingChanged.id,
      driverName: bookingChanged.driverName,
    },
    messageKey: "TripStarted.Message",
    isCritical: true,
    link: `/rider/myBookings/${bookingChanged.id}`,
  })

  return newTripLog
}
