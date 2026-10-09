"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ModifyDriverLeaveRequestType } from "@ryogo-travel-app/api/types/driverLeave.types"
import {
  DriverLeaveStatusEnum,
  EntityTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"

export async function modifyDriverLeaveAction({
  data,
}: {
  data: ModifyDriverLeaveRequestType
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
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

  const leave = await driverServices.modifyDriverLeave(data)
  if (!leave) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: leave.driverId,
    isFeed: true,
    textKey: "DriverLeaveModified",
    textObject: {
      driverName: leave.driverName,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${leave.driverId}/leaves`,
  })

  if (leave.status === DriverLeaveStatusEnum.PENDING) {
    //Replace previous newLeave mission
    await missionServices.addMission({
      agencyId: data.agencyId,
      userId: currentUser.userId,
      entityType: EntityTypeEnum.DRIVER_LEAVE,
      entityId: leave.id,
      titleKey: "DriverLeaveAdded.Title",
      titleObject: {
        driverId: leave.driverId,
      },
      messageKey: "DriverLeaveAdded.Message",
      messageObject: {
        startDate: leave.startDate,
        endDate: leave.endDate,
      },
      dueDate: leave.startDate,
      link: `/dashboard/drivers/${leave.driverId}/leaves`,
    })
  }

  return leave
}
