"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import {
  DriverLeaveStatusEnum,
  EntityTypeEnum,
  InsertDriverLeaveType,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"

export async function newDriverLeaveAction({
  data,
}: {
  data: InsertDriverLeaveType
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== data.addedByUserId ||
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

  const leave = await driverServices.addDriverLeave(data)
  if (!leave) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER_LEAVE,
    entityId: leave.id,
    isFeed: true,
    textKey: "DriverLeaveAdded",
    textObject: {
      driverName: leave.driverName,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${leave.driverId}/leaves`,
  })

  if (leave.status === DriverLeaveStatusEnum.PENDING) {
    //Add newleave mission for assignedUser
    await missionServices.addMission(
      {
        agencyId: data.agencyId,
        userId: currentUser.userId,
        entityType: EntityTypeEnum.DRIVER_LEAVE,
        entityId: leave.id,
        titleKey: "DriverLeaveAdded.Title",
        titleObject: {
          driverName: leave.driverName,
        },
        messageKey: "DriverLeaveAdded.Message",
        messageObject: {
          startDate: leave.startDate,
          endDate: leave.endDate,
        },
        dueDate: leave.startDate,
        link: `/dashboard/drivers/${leave.driverId}/leaves`,
      },
      false,
    )
  }

  return leave
}
