"use server"

import { writePermissions } from "@/lib/permissions"
import {
  generateInsurancePhotoPathName,
  generatePUCPhotoPathName,
  generateRCPhotoPathName,
  generateVehiclePhotoPathName,
} from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addVehicleAction(data: AddVehicleRequestType) {
  const currentUser = await writePermissions.allowDashboardUser(data.agencyId)
  if (!currentUser) {
    return
  }

  const addedVehicle = await vehicleServices.addVehicle(data)
  if (!addedVehicle) return

  let rcPhotoUrl
  let pucPhotoUrl
  let insurancePhotoUrl
  let vehiclePhotoUrl

  // Upload files to Supabase Storage
  const rcFile = data.rcPhotos
  if (rcFile) {
    const uploadedFile = await uploadFile(
      rcFile,
      generateRCPhotoPathName(addedVehicle.id),
    )
    rcPhotoUrl = uploadedFile.path
  }

  const pucFile = data.pucPhotos
  if (pucFile) {
    const uploadedFile = await uploadFile(
      pucFile,
      generatePUCPhotoPathName(addedVehicle.id),
    )
    pucPhotoUrl = uploadedFile.path
  }

  const insuranceFile = data.insurancePhotos
  if (insuranceFile) {
    const uploadedFile = await uploadFile(
      insuranceFile,
      generateInsurancePhotoPathName(addedVehicle.id),
    )
    insurancePhotoUrl = uploadedFile.path
  }

  const vehiclePhotoFile = data.vehiclePhotos
  if (vehiclePhotoFile) {
    const uploadedFile = await uploadFile(
      vehiclePhotoFile,
      generateVehiclePhotoPathName(addedVehicle.id),
    )
    vehiclePhotoUrl = uploadedFile.path
  }

  if (rcPhotoUrl || pucPhotoUrl || insurancePhotoUrl || vehiclePhotoUrl) {
    await vehicleServices.changeVehicleDocURLs({
      vehicleId: addedVehicle.id,
      rcPhotoUrl,
      pucPhotoUrl,
      insurancePhotoUrl,
      vehiclePhotoUrl,
    })
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: addedVehicle.id,
    isFeed: true,
    textKey: "VehicleAdded",
    textObject: {
      vehicleNumber: addedVehicle.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${addedVehicle.id}`,
  })

  return addedVehicle
}
