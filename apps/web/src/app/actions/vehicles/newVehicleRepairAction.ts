"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  EntityTypeEnum,
  InsertVehicleRepairType,
  UserRolesEnum,
  VehicleRepairStatusEnum,
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

  if (!(await verifyCurrentUser())) {
    return
  }

  const repair = await vehicleServices.addVehicleRepair(data)
  if (!repair) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE_REPAIR,
    entityId: repair.id,
    isFeed: true,
    textKey: "VehicleRepairAdded",
    textObject: {
      vehicleNumber: repair.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${repair.vehicleId}/repairs`,
  })

  if (repair.status === VehicleRepairStatusEnum.PENDING) {
    // Add newRepair mission for assignedUser
    await missionServices.addMission(
      {
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
      },
      false,
    )
  }

  return repair
}
