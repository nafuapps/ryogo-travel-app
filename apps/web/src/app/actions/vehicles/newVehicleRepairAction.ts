"use server"

import { writePermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  EntityTypeEnum,
  InsertVehicleRepairType,
  VehicleRepairStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { format } from "date-fns"

export async function newVehicleRepairAction(data: InsertVehicleRepairType) {
  const currentUser = await writePermissions.allowDashboardUser(data.agencyId)
  if (!currentUser) return

  const addedRepair = await vehicleServices.addVehicleRepair(data)
  if (!addedRepair) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE_REPAIR,
    entityId: addedRepair.id,
    isFeed: true,
    textKey: "VehicleRepairAdded",
    textObject: {
      vehicleNumber: addedRepair.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${addedRepair.vehicleId}/repairs`,
  })

  if (addedRepair.status === VehicleRepairStatusEnum.PENDING) {
    // Add newRepair mission for assignedUser
    await missionServices.addMission(
      {
        agencyId: data.agencyId,
        userId: currentUser.userId,
        entityType: EntityTypeEnum.VEHICLE_REPAIR,
        entityId: addedRepair.id,
        titleKey: "VehicleRepairAdded.Title",
        titleObject: {
          vehicleNumber: addedRepair.vehicleNumber,
        },
        messageKey: "VehicleRepairAdded.Message",
        messageObject: {
          startDate: format(addedRepair.startDate, "dd MMM yyyy"),
          endDate: format(addedRepair.endDate, "dd MMM yyyy"),
        },
        dueDate: addedRepair.startDate,
        link: `/dashboard/vehicles/${addedRepair.vehicleId}/repairs`,
      },
      false,
    )
  }

  return addedRepair
}
