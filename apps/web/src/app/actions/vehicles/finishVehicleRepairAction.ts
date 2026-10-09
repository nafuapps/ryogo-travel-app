"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

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
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.agencyId !== agencyId ||
    (currentUser.userId !== userId &&
      currentUser.userRole !== UserRolesEnum.OWNER)
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const repair = await vehicleServices.endVehicleRepair({ repairId, vehicleId })
  if (!repair) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE_REPAIR,
    entityId: repair.id,
    isFeed: true,
    textKey: "VehicleRepairEnded",
    textObject: {
      endDate: repair.actualEndDate,
      userName: currentUser.name,
      vehicleNumber: repair.vehicle.vehicleNumber,
    },
    link: `/dashboard/vehicles/${repair.vehicleId}/repairs`,
  })

  // Remove previous vehicleRepair missions
  await missionServices.removePreviousMissionsByEntityId({
    agencyId: agencyId,
    entityId: repair.id,
  })

  return repair
}
