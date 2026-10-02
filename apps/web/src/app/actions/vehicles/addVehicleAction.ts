"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import {
  generateInsurancePhotoPathName,
  generatePUCPhotoPathName,
  generateRCPhotoPathName,
  generateVehiclePhotoPathName,
} from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addVehicleAction(data: AddVehicleRequestType) {
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

  const vehicle = await vehicleServices.addVehicle(data)
  if (!vehicle) return

  let rcUrl
  let pucUrl
  let insuranceUrl
  let vehiclePhotoUrl

  // Upload files to Supabase Storage
  const [rcFile] = data.data.rcPhotos || []
  if (rcFile) {
    const uploadedFile = await uploadFile(
      rcFile,
      generateRCPhotoPathName(vehicle.id, rcFile),
    )
    rcUrl = uploadedFile.path
  }

  const [pucFile] = data.data.pucPhotos || []
  if (pucFile) {
    const uploadedFile = await uploadFile(
      pucFile,
      generatePUCPhotoPathName(vehicle.id, pucFile),
    )
    pucUrl = uploadedFile.path
  }

  const [insuranceFile] = data.data.insurancePhotos || []
  if (insuranceFile) {
    const uploadedFile = await uploadFile(
      insuranceFile,
      generateInsurancePhotoPathName(vehicle.id, insuranceFile),
    )
    insuranceUrl = uploadedFile.path
  }

  const [vehiclePhotoFile] = data.data.vehiclePhotos || []
  if (vehiclePhotoFile) {
    const uploadedFile = await uploadFile(
      vehiclePhotoFile,
      generateVehiclePhotoPathName(vehicle.id, vehiclePhotoFile),
    )
    vehiclePhotoUrl = uploadedFile.path
  }

  if (rcUrl || pucUrl || insuranceUrl || vehiclePhotoUrl) {
    await vehicleServices.renewVehicleDocURLs(
      vehicle.id,
      rcUrl,
      pucUrl,
      insuranceUrl,
      vehiclePhotoUrl,
    )
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: vehicle.id,
    isFeed: true,
    textKey: "VehicleAdded",
    textObject: {
      vehicleNumber: vehicle.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${vehicle.id}`,
  })

  return vehicle
}
