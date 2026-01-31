"use server"

import { generateVehiclePhotoPathName } from "@/lib/utils"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeVehiclePhotoAction(
  vehicleId: string,
  photo: FileList,
) {
  if (photo && photo[0]) {
    const file = photo[0]
    const uploadedPhoto = await uploadFile(
      file,
      generateVehiclePhotoPathName(vehicleId, file),
    )
    const user = await vehicleServices.renewVehiclePhotoURL(
      vehicleId,
      uploadedPhoto.path,
    )

    if (!user) return false
    return true
  } else {
    return false
  }
}
