"use server"
import { getCurrentUser } from "@/lib/auth"
import { generateTripLogPhotoPathName } from "@/lib/utils"
import { tripLogServices } from "@ryogo-travel-app/api/services/tripLog.services"
import { AddTripLogRequestType } from "@ryogo-travel-app/api/types/tripLog.types"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function midTripAction(data: AddTripLogRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.DRIVER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }
  // Create Mid Trip Log
  const newTripLog = await tripLogServices.addTripLog({
    driverId: data.driverId,
    bookingId: data.bookingId,
    vehicleId: data.vehicleId,
    agencyId: data.agencyId,
    odometerReading: data.odometerReading,
    type: data.type,
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

  return newTripLog
}
