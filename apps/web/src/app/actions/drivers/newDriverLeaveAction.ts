"use server"

import { writePermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import {
  DriverLeaveStatusEnum,
  EntityTypeEnum,
  InsertDriverLeaveType,
} from "@ryogo-travel-app/db/schema"

export async function newDriverLeaveAction({
  data,
}: {
  data: InsertDriverLeaveType
}) {
  const currentUser = await writePermissions.allowDashboardUser(data.agencyId)
  if (!currentUser) return

  const addedLeave = await driverServices.addDriverLeave(data)
  if (!addedLeave) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER_LEAVE,
    entityId: addedLeave.id,
    isFeed: true,
    textKey: "DriverLeaveAdded",
    textObject: {
      driverName: addedLeave.driverName,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${addedLeave.driverId}/leaves`,
  })

  if (addedLeave.status === DriverLeaveStatusEnum.PENDING) {
    //Add newleave mission for assignedUser
    await missionServices.addMission(
      {
        agencyId: data.agencyId,
        userId: currentUser.userId,
        entityType: EntityTypeEnum.DRIVER_LEAVE,
        entityId: addedLeave.id,
        titleKey: "DriverLeaveAdded.Title",
        titleObject: {
          driverName: addedLeave.driverName,
        },
        messageKey: "DriverLeaveAdded.Message",
        messageObject: {
          startDate: addedLeave.startDate,
          endDate: addedLeave.endDate,
        },
        dueDate: addedLeave.startDate,
        link: `/dashboard/drivers/${addedLeave.driverId}/leaves`,
      },
      false,
    )
  }

  return addedLeave
}
