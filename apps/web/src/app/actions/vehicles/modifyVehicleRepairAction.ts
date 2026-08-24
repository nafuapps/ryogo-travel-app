"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { ModifyVehicleRepairRequestType } from "@ryogo-travel-app/api/types/vehicleRepair.types"

export async function modifyVehicleRepairAction(
  data: ModifyVehicleRepairRequestType,
) {
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

  const repair = await vehicleServices.modifyVehicleRepair(data)
  if (!repair) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: repair.vehicleId,
    isFeed: true,
    textKey: "VehicleRepairModified",
    textObject: {
      vehicleNumber: repair.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${repair.vehicleId}/repairs`,
  })

  return repair
}
