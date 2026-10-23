"use server"

import { writePermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function finishDriverLeaveAction({
  userId,
  driverId,
  leaveId,
  agencyId,
}: {
  userId: string
  driverId: string
  leaveId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const endedLeave = await driverServices.endDriverLeave({ leaveId, driverId })
  if (!endedLeave) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER_LEAVE,
    entityId: endedLeave.id,
    isFeed: true,
    textKey:
      currentUser.userRole === UserRolesEnum.DRIVER
        ? "EndedDriverLeave"
        : "DriverLeaveEnded",
    textObject: {
      endDate: endedLeave.actualEndDate,
      userName: currentUser.name,
      driverName: endedLeave.driver.name,
    },
    link: `/dashboard/drivers/${endedLeave.driverId}/leaves`,
  })

  // Remove previous driverLeave missions
  await missionServices.removePreviousMissionsByEntityId({
    agencyId: agencyId,
    entityId: endedLeave.id,
  })

  return endedLeave
}
