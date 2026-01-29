"use server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { tripLogServices } from "@ryogo-travel-app/api/services/tripLog.services"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
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
  //Change Booking, Driver and vehicle status to Completed
  const bookingChanged = await bookingServices.changeBookingToCompleted(
    data.bookingId,
    data.driverId,
    data.vehicleId,
  )
  if (!bookingChanged) return false

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
  if (!newTripLog) return false

  //Upload triplog photo if attached
  if (data.tripLogPhoto && data.tripLogPhoto[0]) {
    const fileName = `${Date.now()}-${data.tripLogPhoto[0].name}-${TripLogTypesEnum.END_TRIP}-${newTripLog.id}`
    const uploadedFile = await uploadFile(
      data.tripLogPhoto[0],
      `${data.bookingId}/tripLogs/${fileName}`,
    )
    await tripLogServices.changeTripLogPhotoUrl(
      newTripLog.id,
      uploadedFile.path,
    )
  }
  return true
}
