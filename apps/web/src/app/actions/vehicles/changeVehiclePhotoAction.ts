"use server"

import { writePermissions } from "@/lib/permissions"
import { generateVehiclePhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeVehiclePhotoAction({
  vehicleId,
  agencyId,
  photo,
}: {
  vehicleId: string
  agencyId: string
  photo: File
}) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) {
    return
  }

  const uploadedPhoto = await uploadFile(
    photo,
    generateVehiclePhotoPathName(vehicleId),
  )
  const updatedVehicle = await vehicleServices.renewVehiclePhotoURL({
    vehicleId,
    vehiclePhotoUrl: uploadedPhoto.path,
  })
  if (!updatedVehicle) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
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
