"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { ModifyVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

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

  const vehicle = await vehicleServices.modifyVehicle(data)
  if (!vehicle) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
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
