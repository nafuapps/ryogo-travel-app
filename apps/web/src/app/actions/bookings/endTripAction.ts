"use server"
import { getCurrentUser } from "@/lib/auth"
import { generateTripLogPhotoPathName } from "@/lib/utils"
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
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function endTripAction(
  data: AddTripLogRequestType,
  customerId: string,
  customerRatingData?: number,
  bookingRatingData?: number,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.DRIVER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  // Create End Trip Log
  const newTripLog = await tripLogServices.addTripLog({
    driverId: data.driverId,
    bookingId: data.bookingId,
    vehicleId: data.vehicleId,
    agencyId: data.agencyId,
    odometerReading: data.odometerReading,
    type: TripLogTypesEnum.END_TRIP,
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
