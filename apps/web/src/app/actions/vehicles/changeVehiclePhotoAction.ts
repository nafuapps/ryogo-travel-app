"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateVehiclePhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeVehiclePhotoAction(
  vehicleId: string,
  agencyId: string,
  photo: FileList,
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
  if (!photo[0]) {
    return
  }

  const file = photo[0]
  const uploadedPhoto = await uploadFile(
    file,
    generateVehiclePhotoPathName(vehicleId, file),
  )
  const updatedVehicle = await vehicleServices.renewVehiclePhotoURL(
    vehicleId,
    uploadedPhoto.path,
  )
  if (!updatedVehicle) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: updatedVehicle.id,
    isFeed: true,
    textKey: "VehiclePhotoChanged",
    textObject: {
      vehicleNumber: updatedVehicle.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${updatedVehicle.id}`,
  })

  return updatedVehicle
}
