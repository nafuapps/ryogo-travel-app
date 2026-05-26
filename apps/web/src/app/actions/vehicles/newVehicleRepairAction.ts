"use server"

import { getCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  EntityTypeEnum,
  InsertVehicleRepairType,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"

export async function newVehicleRepairAction(data: InsertVehicleRepairType) {
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
  const repair = await vehicleServices.addVehicleRepair(data)
  if (!repair) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: repair.vehicleId,
    isFeed: true,
    textKey: "VehicleRepairAdded",
    textObject: {
      vehicleNumber: repair.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${repair.vehicleId}/repairs`,
  })

  return repair
}
