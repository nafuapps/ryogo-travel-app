"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import {
  generateInsurancePhotoPathName,
  generatePUCPhotoPathName,
  generateRCPhotoPathName,
} from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { ChangeVehicleDocumentRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeVehicleDocumentAction(
  data: ChangeVehicleDocumentRequestType,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== data.addedByUserId) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  let fileUrl
  if (data.photo && data.photo[0]) {
    const file = data.photo[0]
    const pathName =
      data.type === "rc"
        ? generateRCPhotoPathName(data.vehicleId, file)
        : data.type === "puc"
          ? generatePUCPhotoPathName(data.vehicleId, file)
          : generateInsurancePhotoPathName(data.vehicleId, file)
    const uploadedPhoto = await uploadFile(file, pathName)
    fileUrl = uploadedPhoto.path
  }

  const vehicle = await vehicleServices.changeVehicleDocument(data, fileUrl)
  if (!vehicle) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: vehicle.id,
    isFeed: true,
    textKey: "VehicleDocumentModified",
    textObject: {
      vehicleNumber: vehicle.vehicleNumber,
      type: data.type.toUpperCase(),
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${vehicle.id}`,
  })

  return vehicle
}
