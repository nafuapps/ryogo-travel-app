"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  EntityTypeEnum,
  UserRolesEnum,
  VehicleRepairStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { ModifyVehicleRepairRequestType } from "@ryogo-travel-app/api/types/vehicleRepair.types"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"

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
    userId: currentUser.userId,
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

  if (repair.status === VehicleRepairStatusEnum.PENDING) {
    //Replace previous newRepair mission
    await missionServices.addMission({
      agencyId: data.agencyId,
      userId: currentUser.userId,
      entityType: EntityTypeEnum.VEHICLE_REPAIR,
      entityId: repair.id,
      titleKey: "VehicleRepairAdded.Title",
      titleObject: {
        vehicleNumber: repair.vehicleNumber,
      },
      messageKey: "VehicleRepairAdded.Message",
      messageObject: {
        startDate: repair.startDate,
        endDate: repair.endDate,
      },
      dueDate: repair.startDate,
      link: `/dashboard/vehicles/${repair.vehicleId}/repairs`,
    })
  }

  return repair
}
