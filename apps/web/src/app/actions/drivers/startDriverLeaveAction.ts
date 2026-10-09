"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function startDriverLeaveAction({
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

  const leave = await driverServices.startDriverLeave({ leaveId, driverId })
  if (!leave) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER_LEAVE,
    entityId: leave.id,
    isFeed: true,
    textKey:
      currentUser.userRole === UserRolesEnum.DRIVER
        ? "StartedDriverLeave"
        : "DriverLeaveStarted",
    textObject: {
      startDate: leave.actualStartDate,
      userName: currentUser.name,
      driverName: leave.driver.name,
    },
    link: `/dashboard/drivers/${leave.driverId}/leaves`,
  })

  //Add startedLeave mission for assignedUser if started by driver and vice versa
  await missionServices.addMission({
    agencyId: agencyId,
    userId:
      currentUser.userRole === UserRolesEnum.DRIVER
        ? leave.addedByUserId
        : leave.driver.userId,
    entityType: EntityTypeEnum.DRIVER_LEAVE,
    entityId: leave.id,
    titleKey: "DriverLeaveStarted.Title",
    titleObject: {
      driverId: leave.driverId,
    },
    messageKey: "DriverLeaveStarted.Message",
    messageObject: {
      startDate: leave.actualStartDate,
      endDate: leave.endDate,
    },
    dueDate: leave.endDate,
    link:
      currentUser.userRole === UserRolesEnum.DRIVER
        ? `/dashboard/drivers/${leave.driverId}/leaves`
        : "rider/myLeaves",
  })

  //Remove newLeave mission
  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId: agencyId,
    entityType: EntityTypeEnum.DRIVER_LEAVE,
    entityId: leave.id,
    titleKey: "DriverLeaveAdded.Title",
  })

  return leave
}
