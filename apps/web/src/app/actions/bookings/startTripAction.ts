"use server"

import { writePermissions } from "@/lib/permissions"
import { generateTripLogPhotoPathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { tripLogServices } from "@ryogo-travel-app/api/services/tripLog.services"
import { AddTripLogRequestType } from "@ryogo-travel-app/api/types/tripLog.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function startTripAction({
  data,
  assignedDriverUserId,
}: {
  data: AddTripLogRequestType
  assignedDriverUserId?: string | null
}) {
  const currentUser = await writePermissions.allowAssignedDriver({
    agencyId: data.agencyId,
    assignedDriverUserId,
  })
  if (!currentUser) {
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
  const newTripLog = await tripLogServices.addTripLog(data)
  if (!newTripLog) return

  //Upload triplog photo if attached
  const tripLogPhotoFile = data.tripLogPhoto
  if (tripLogPhotoFile) {
    const uploadedFile = await uploadFile(
      tripLogPhotoFile,
      generateTripLogPhotoPathName(data.bookingId, newTripLog.id),
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
