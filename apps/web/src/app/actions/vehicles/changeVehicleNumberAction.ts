"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function changeVehicleNumberAction(
  vehicleId: string,
  agencyId: string,
  addedByUserId: string,
  newVehicleNumber: string,
  oldVehicleNumber: string,
) {
  if (oldVehicleNumber === newVehicleNumber) {
    return
  }

  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId,
    assignedUserId: addedByUserId,
  })
  if (!currentUser) {
    return
  }

  const changedVehicle = await vehicleServices.changeVehicleNumber({
    vehicleId,
    vehicleNumber: newVehicleNumber,
  })
  if (!changedVehicle) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: changedVehicle.id,
    isFeed: true,
    textKey: "VehicleNumberModified",
    textObject: {
      oldVehicleNumber: oldVehicleNumber,
      newVehicleNumber: changedVehicle.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${changedVehicle.id}`,
  })

  return changedVehicle
}
