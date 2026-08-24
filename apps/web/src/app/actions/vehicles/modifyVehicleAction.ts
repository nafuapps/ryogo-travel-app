"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import {
  generateInsurancePhotoPathName,
  generatePUCPhotoPathName,
  generateRCPhotoPathName,
} from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { ModifyVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyVehicleAction(data: ModifyVehicleRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  let rcUrl
  let insuranceUrl
  let pucUrl

  // Upload files to Supabase Storage
  if (data.rcPhotos && data.rcPhotos[0]) {
    const rc = data.rcPhotos[0]
    const uploadedFile = await uploadFile(
      rc,
      generateRCPhotoPathName(data.vehicleId, rc),
    )
    rcUrl = uploadedFile.path
  }
  if (data.pucPhotos && data.pucPhotos[0]) {
    const puc = data.pucPhotos[0]
    const uploadedFile = await uploadFile(
      puc,
      generatePUCPhotoPathName(data.vehicleId, puc),
    )
    pucUrl = uploadedFile.path
  }
  if (data.insurancePhotos && data.insurancePhotos[0]) {
    const insurance = data.insurancePhotos[0]
    const uploadedFile = await uploadFile(
      insurance,
      generateInsurancePhotoPathName(data.vehicleId, insurance),
    )
    insuranceUrl = uploadedFile.path
  }

  const vehicle = await vehicleServices.modifyVehicle(
    data,
    rcUrl,
    pucUrl,
    insuranceUrl,
  )
  if (!vehicle) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: vehicle.id,
    isFeed: true,
    textKey: "VehicleModified",
    textObject: {
      vehicleNumber: vehicle.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${vehicle.id}`,
  })

  return vehicle
}
