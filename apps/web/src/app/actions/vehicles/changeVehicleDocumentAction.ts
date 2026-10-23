"use server"

import { writePermissions } from "@/lib/permissions"
import {
  generateInsurancePhotoPathName,
  generatePUCPhotoPathName,
  generateRCPhotoPathName,
} from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { ChangeVehicleDocumentRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeVehicleDocumentAction(
  data: ChangeVehicleDocumentRequestType,
) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: data.agencyId,
    assignedUserId: data.addedByUserId,
  })
  if (!currentUser) {
    return
  }

  let fileUrl

  const file = data.photo
  if (file) {
    const pathName =
      data.type === "rc"
        ? generateRCPhotoPathName(data.vehicleId)
        : data.type === "puc"
          ? generatePUCPhotoPathName(data.vehicleId)
          : generateInsurancePhotoPathName(data.vehicleId)
    const uploadedPhoto = await uploadFile(file, pathName)
    fileUrl = uploadedPhoto.path
  }

  const changedVehicle = await vehicleServices.changeVehicleDocument(
    data,
    fileUrl,
  )
  if (!changedVehicle) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: changedVehicle.id,
    isFeed: true,
    textKey: "VehicleDocumentModified",
    textObject: {
      vehicleNumber: changedVehicle.vehicleNumber,
      type: data.type.toUpperCase(),
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${changedVehicle.id}`,
  })

  return changedVehicle
}
