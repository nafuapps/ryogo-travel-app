"use server"

import { generateLicensePhotoPathName } from "@/lib/utils"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { SelectDriverType, VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyDriverAction(
  id: string,
  data: {
    address?: string
    canDriveVehicleTypes?: VehicleTypesEnum[]
    defaultAllowancePerDay?: number
    licenseNumber?: string
    licenseExpiresOn?: Date
    licensePhotos?: FileList
  },
) {
  let licenseUrl

  // Upload files to Supabase Storage
  if (data.licensePhotos && data.licensePhotos[0]) {
    const license = data.licensePhotos[0]
    const uploadedFile = await uploadFile(
      license,
      generateLicensePhotoPathName(id, license),
    )
    licenseUrl = uploadedFile.path
  }

  const driver: SelectDriverType[] = await driverServices.modifyDriver(
    id,
    data.address,
    data.canDriveVehicleTypes,
    data.defaultAllowancePerDay,
    data.licenseNumber,
    data.licenseExpiresOn,
    licenseUrl,
  )
  return driver[0]
}
