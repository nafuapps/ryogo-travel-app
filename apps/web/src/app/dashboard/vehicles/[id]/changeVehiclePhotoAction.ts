"use server"

import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeVehiclePhotoAction(
  vehicleId: string,
  photo: FileList,
) {
  if (photo && photo[0]) {
    const file = photo[0]
    const fileName = `${Date.now()}-${file.name}`
    const uploadedPhoto = await uploadFile(
      file,
      `${vehicleId}/vehiclePhoto/${fileName}`,
    )
    const url = uploadedPhoto!.path
    const user = await vehicleServices.renewVehiclePhotoURL(vehicleId, url)

    if (!user) return false
    return true
  } else {
    return false
  }
}
