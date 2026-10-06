"use server"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
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

  if (!(await verifyCurrentUser())) {
    return
  }

  //Change Booking, Driver and vehicle status to In trip
  const bookingChanged = await bookingServices.changeBookingToInProgress({
    bookingId: data.bookingId,
    driverId: data.driverId,
    vehicleId: data.vehicleId,
  })
  if (!bookingChanged) return

  // Create Start Trip Log
  const newTripLog = await tripLogServices.addTripLog({
    driverId: data.driverId,
    bookingId: data.bookingId,
    vehicleId: data.vehicleId,
    agencyId: data.agencyId,
    odometerReading: data.odometerReading,
    type: TripLogTypesEnum.STARTED,
    remarks: data.remarks,
    lat: data.lat,
    long: data.long,
  })
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

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
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
    },
    messageKey: "TripStarted.Message",
    messageObject: {
      driverName: bookingChanged.driverName,
    },
    isCritical: true,
    link: `/rider/myBookings/${bookingChanged.id}`,
  })

  //Remove confirmed booking mission for the agent
  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingChanged.id,
    titleKey: "ConfirmedBooking.Title",
  })

  //Remove assigned driver mission for the driver
  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingChanged.id,
    titleKey: "AssignedDriver.Title",
  })

  //Remove assigned vehicle mission for the driver
  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingChanged.id,
    titleKey: "AssignedVehicle.Title",
  })

  return newTripLog
}
