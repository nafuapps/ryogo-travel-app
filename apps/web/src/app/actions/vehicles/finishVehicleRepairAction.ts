"use server"

import { writePermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function finishVehicleRepairAction({
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

  const endedRepair = await vehicleServices.endVehicleRepair({
    repairId,
    vehicleId,
  })
  if (!endedRepair) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE_REPAIR,
    entityId: endedRepair.id,
    isFeed: true,
    textKey: "VehicleRepairEnded",
    textObject: {
      endDate: endedRepair.actualEndDate,
      userName: currentUser.name,
      vehicleNumber: endedRepair.vehicle.vehicleNumber,
    },
    link: `/dashboard/vehicles/${endedRepair.vehicleId}/repairs`,
  })

  // Remove previous vehicleRepair missions
  await missionServices.removePreviousMissionsByEntityId({
    agencyId: agencyId,
    entityId: endedRepair.id,
  })

  return endedRepair
}
