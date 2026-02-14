"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateLicensePhotoPathName } from "@/lib/utils"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { UserRolesEnum, VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyDriverAction(
  id: string,
  agencyId: string,
  data: {
    address?: string
    canDriveVehicleTypes?: VehicleTypesEnum[]
    defaultAllowancePerDay?: number
    licenseNumber?: string
    licenseExpiresOn?: Date
    licensePhotos?: FileList
  },
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

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

  const driver = await driverServices.modifyDriver(
    id,
    data.address,
    data.canDriveVehicleTypes,
    data.defaultAllowancePerDay,
    data.licenseNumber,
    data.licenseExpiresOn,
    licenseUrl,
  )
  return driver
}
