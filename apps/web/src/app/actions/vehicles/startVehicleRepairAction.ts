"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

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

  const repair = await vehicleServices.startVehicleRepair({
    repairId,
    vehicleId,
  })
  if (!repair) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE_REPAIR,
    entityId: repair.id,
    isFeed: true,
    textKey: "VehicleRepairStarted",
    textObject: {
      startDate: repair.actualStartDate,
      userName: currentUser.name,
      vehicleNumber: repair.vehicle.vehicleNumber,
    },
    link: `/dashboard/vehicles/${repair.vehicleId}/repairs`,
  })

  // Add startedRepair mission for assignedUser
  await missionServices.addMission({
    agencyId: agencyId,
    userId: repair.addedByUserId,
    entityType: EntityTypeEnum.VEHICLE_REPAIR,
    entityId: repair.id,
    titleKey: "VehicleRepairStarted.Title",
    titleObject: {
      vehicleNumber: repair.vehicle.vehicleNumber,
    },
    messageKey: "VehicleRepairStarted.Message",
    messageObject: {
      startDate: repair.actualStartDate,
      endDate: repair.endDate,
    },
    dueDate: repair.endDate,
    link: `/dashboard/vehicles/${repair.vehicleId}/repairs`,
  })

  //Remove newRepair mission
  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId: agencyId,
    entityType: EntityTypeEnum.VEHICLE_REPAIR,
    entityId: repair.id,
    titleKey: "VehicleRepairAdded.Title",
  })

  return repair
}
