"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { ModifyVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function modifyVehicleAction(data: ModifyVehicleRequestType) {
  const currentUser = await writePermissions.allowDashboardUser(data.agencyId)
  if (!currentUser) return

  const modifiedVehicle = await vehicleServices.modifyVehicle(data)
  if (!modifiedVehicle) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: modifiedVehicle.id,
    isFeed: true,
    textKey: "VehicleModified",
    textObject: {
      vehicleNumber: modifiedVehicle.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${modifiedVehicle.id}`,
  })

  return modifiedVehicle
}
