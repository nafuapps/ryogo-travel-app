"use server"

import { writePermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function startVehicleRepairAction({
  userId,
  vehicleId,
  repairId,
  agencyId,
}: {
  userId: string
  vehicleId: string
  repairId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const startedRepair = await vehicleServices.startVehicleRepair({
    repairId,
    vehicleId,
  })
  if (!startedRepair) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE_REPAIR,
    entityId: startedRepair.id,
    isFeed: true,
    textKey: "VehicleRepairStarted",
    textObject: {
      startDate: startedRepair.actualStartDate,
      userName: currentUser.name,
      vehicleNumber: startedRepair.vehicle.vehicleNumber,
    },
    link: `/dashboard/vehicles/${startedRepair.vehicleId}/repairs`,
  })

  // Add startedRepair mission for assignedUser
  await missionServices.addMission({
    agencyId: agencyId,
    userId: startedRepair.addedByUserId,
    entityType: EntityTypeEnum.VEHICLE_REPAIR,
    entityId: startedRepair.id,
    titleKey: "VehicleRepairStarted.Title",
    titleObject: {
      vehicleNumber: startedRepair.vehicle.vehicleNumber,
    },
    messageKey: "VehicleRepairStarted.Message",
    messageObject: {
      startDate: startedRepair.actualStartDate,
      endDate: startedRepair.endDate,
    },
    dueDate: startedRepair.endDate,
    link: `/dashboard/vehicles/${startedRepair.vehicleId}/repairs`,
  })

  //Remove newRepair mission
  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId: agencyId,
    entityType: EntityTypeEnum.VEHICLE_REPAIR,
    entityId: startedRepair.id,
    titleKey: "VehicleRepairAdded.Title",
  })

  return startedRepair
}
