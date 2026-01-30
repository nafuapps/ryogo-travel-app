"use server"

import {
  generateInsurancePhotoPathName,
  generatePUCPhotoPathName,
  generateRCPhotoPathName,
  generateVehiclePhotoPathName,
} from "@/lib/utils"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function newVehicleAction(data: AddVehicleRequestType) {
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
        generateRCPhotoPathName(vehicle.id, rc),
      )
      rcUrl = uploadedFile.path
    }
    if (data.data.pucPhotos && data.data.pucPhotos[0]) {
      const puc = data.data.pucPhotos[0]
      const uploadedFile = await uploadFile(
        puc,
        generatePUCPhotoPathName(vehicle.id, puc),
      )
      pucUrl = uploadedFile.path
    }
    if (data.data.insurancePhotos && data.data.insurancePhotos[0]) {
      const insurance = data.data.insurancePhotos[0]
      const uploadedFile = await uploadFile(
        insurance,
        generateInsurancePhotoPathName(vehicle.id, insurance),
      )
      insuranceUrl = uploadedFile.path
    }
    if (data.data.vehiclePhotos && data.data.vehiclePhotos[0]) {
      const vehiclePhoto = data.data.vehiclePhotos[0]
      const uploadedFile = await uploadFile(
        vehiclePhoto,
        generateVehiclePhotoPathName(vehicle.id, vehiclePhoto),
      )
      vehiclePhotoUrl = uploadedFile.path
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
