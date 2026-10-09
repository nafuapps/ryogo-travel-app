"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
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

  const leave = await driverServices.endDriverLeave({ leaveId, driverId })
  if (!leave) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER_LEAVE,
    entityId: leave.id,
    isFeed: true,
    textKey:
      currentUser.userRole === UserRolesEnum.DRIVER
        ? "EndedDriverLeave"
        : "DriverLeaveEnded",
    textObject: {
      endDate: leave.actualEndDate,
      userName: currentUser.name,
      driverName: leave.driver.name,
    },
    link: `/dashboard/drivers/${leave.driverId}/leaves`,
  })

  // Remove previous driverLeave missions
  await missionServices.removePreviousMissionsByEntityId({
    agencyId: agencyId,
    entityId: leave.id,
  })

  return leave
}
