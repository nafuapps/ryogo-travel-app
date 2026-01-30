"use server"

import {
  generateInsurancePhotoPathName,
  generatePUCPhotoPathName,
  generateRCPhotoPathName,
} from "@/lib/utils"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  SelectVehicleType,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyVehicleAction(
  id: string,
  data: {
    type?: VehicleTypesEnum
    brand?: string
    color?: string
    model?: string
    capacity?: number
    odometerReading?: number
    rcExpiresOn?: Date
    insuranceExpiresOn?: Date
    pucExpiresOn?: Date
    defaultRatePerKm?: number
    hasAC?: boolean
    defaultAcChargePerDay?: number
    rcPhotos?: FileList
    pucPhotos?: FileList
    insurancePhotos?: FileList
  },
) {
  let rcUrl
  let insuranceUrl
  let pucUrl

  // Upload files to Supabase Storage
  if (data.rcPhotos && data.rcPhotos[0]) {
    const rc = data.rcPhotos[0]
    const uploadedFile = await uploadFile(rc, generateRCPhotoPathName(id, rc))
    rcUrl = uploadedFile.path
  }
  if (data.pucPhotos && data.pucPhotos[0]) {
    const puc = data.pucPhotos[0]
    const uploadedFile = await uploadFile(
      puc,
      generatePUCPhotoPathName(id, puc),
    )
    pucUrl = uploadedFile.path
  }
  if (data.insurancePhotos && data.insurancePhotos[0]) {
    const insurance = data.insurancePhotos[0]
    const uploadedFile = await uploadFile(
      insurance,
      generateInsurancePhotoPathName(id, insurance),
    )
    insuranceUrl = uploadedFile.path
  }

  const vehicle: SelectVehicleType[] = await vehicleServices.modifyVehicle(
    id,
    data.type,
    data.brand,
    data.color,
    data.model,
    data.capacity,
    data.odometerReading,
    data.rcExpiresOn,
    data.insuranceExpiresOn,
    data.pucExpiresOn,
    data.defaultRatePerKm,
    data.hasAC,
    data.defaultAcChargePerDay,
    rcUrl,
    insuranceUrl,
    pucUrl,
  )
  return vehicle[0]
}
