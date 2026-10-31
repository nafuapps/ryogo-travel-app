"use server"

import { writePermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { ModifyVehicleRepairRequestType } from "@ryogo-travel-app/api/types/vehicleRepair.types"
import {
  EntityTypeEnum,
  VehicleRepairStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { format } from "date-fns"

export async function modifyVehicleRepairAction(
  data: ModifyVehicleRepairRequestType,
) {
  const currentUser = await writePermissions.allowDashboardUser(data.agencyId)
  if (!currentUser) return

  const modifiedRepair = await vehicleServices.modifyVehicleRepair(data)
  if (!modifiedRepair) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: modifiedRepair.vehicleId,
    isFeed: true,
    textKey: "VehicleRepairModified",
    textObject: {
      vehicleNumber: modifiedRepair.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${modifiedRepair.vehicleId}/repairs`,
  })

  if (modifiedRepair.status === VehicleRepairStatusEnum.PENDING) {
    //Replace previous newRepair mission
    await missionServices.addMission({
      agencyId: data.agencyId,
      userId: currentUser.userId,
      entityType: EntityTypeEnum.VEHICLE_REPAIR,
      entityId: modifiedRepair.id,
      titleKey: "VehicleRepairAdded.Title",
      titleObject: {
        vehicleNumber: modifiedRepair.vehicleNumber,
      },
      messageKey: "VehicleRepairAdded.Message",
      messageObject: {
        startDate: format(modifiedRepair.startDate, "dd MMM yyyy"),
        endDate: format(modifiedRepair.endDate, "dd MMM yyyy"),
      },
      dueDate: modifiedRepair.startDate,
      link: `/dashboard/vehicles/${modifiedRepair.vehicleId}/repairs`,
    })
  }

  return modifiedRepair
}
