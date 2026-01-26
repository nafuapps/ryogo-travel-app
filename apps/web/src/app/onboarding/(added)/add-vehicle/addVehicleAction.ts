"use server"

import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addVehicleAction(data: AddVehicleRequestType) {
  const vehicle = await vehicleServices.addVehicle(data)

  if (vehicle.id) {
    let rcUrl
    let pucUrl
    let insuranceUrl
    let vehiclePhotoUrl

    // Upload files to Supabase Storage
    if (data.data.rcPhotos && data.data.rcPhotos[0]) {
      const rc = data.data.rcPhotos[0]
      const uploadedFile = await uploadFile(
        rc,
        `${vehicle.id}/rc/${Date.now()}-${rc.name}`,
      )
      rcUrl = uploadedFile?.path
    }
    if (data.data.pucPhotos && data.data.pucPhotos[0]) {
      const puc = data.data.pucPhotos[0]
      const uploadedFile = await uploadFile(
        puc,
        `${vehicle.id}/puc/${Date.now()}-${puc.name}`,
      )
      pucUrl = uploadedFile?.path
    }
    if (data.data.insurancePhotos && data.data.insurancePhotos[0]) {
      const insurance = data.data.insurancePhotos[0]
      const uploadedFile = await uploadFile(
        insurance,
        `${vehicle.id}/insurance/${Date.now()}-${insurance.name}`,
      )
      insuranceUrl = uploadedFile?.path
    }
    if (data.data.vehiclePhotos && data.data.vehiclePhotos[0]) {
      const vehiclePhoto = data.data.vehiclePhotos[0]
      const uploadedFile = await uploadFile(
        vehiclePhoto,
        `${vehicle.id}/vehiclePhoto/${Date.now()}-${vehiclePhoto.name}`,
      )
      vehiclePhotoUrl = uploadedFile?.path
    }

    await vehicleServices.renewVehicleDocURLs(
      vehicle.id,
      rcUrl,
      pucUrl,
      insuranceUrl,
      vehiclePhotoUrl,
    )
  }
  return vehicle
}
