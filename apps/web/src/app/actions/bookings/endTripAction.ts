"use server"
import { getCurrentUser } from "@/lib/auth"
import { generateTripLogPhotoPathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { tripLogServices } from "@ryogo-travel-app/api/services/tripLog.services"
import { TripLogTypesEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function endTripAction(data: {
  driverId: string
  bookingId: string
  vehicleId: string
  agencyId: string
  odometerReading: number
  remarks?: string
  latLong?: string
  tripLogPhoto?: FileList
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.DRIVER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  //Change Booking, Driver and vehicle status to Completed
  const bookingChanged = await bookingServices.changeBookingToCompleted(
    data.bookingId,
    data.driverId,
    data.vehicleId,
  )
  if (!bookingChanged) return

  // Create End Trip Log
  const newTripLog = await tripLogServices.addTripLog({
    driverId: data.driverId,
    bookingId: data.bookingId,
    vehicleId: data.vehicleId,
    agencyId: data.agencyId,
    odometerReading: data.odometerReading,
    tripLogType: TripLogTypesEnum.END_TRIP,
    remarks: data.remarks,
    latLong: data.latLong,
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
  return newTripLog
}
