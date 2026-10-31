"use server"

import { writePermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ModifyDriverLeaveRequestType } from "@ryogo-travel-app/api/types/driverLeave.types"
import {
  DriverLeaveStatusEnum,
  EntityTypeEnum,
} from "@ryogo-travel-app/db/schema"
import { format } from "date-fns"

export async function modifyDriverLeaveAction({
  data,
}: {
  data: ModifyDriverLeaveRequestType
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: data.agencyId,
    assignedUserId: data.addedByUserId,
  })
  if (!currentUser) return

  const modifiedLeave = await driverServices.modifyDriverLeave(data)
  if (!modifiedLeave) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: modifiedLeave.driverId,
    isFeed: true,
    textKey: "DriverLeaveModified",
    textObject: {
      driverName: modifiedLeave.driverName,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${modifiedLeave.driverId}/leaves`,
  })

  if (modifiedLeave.status === DriverLeaveStatusEnum.PENDING) {
    //Replace previous newLeave mission
    await missionServices.addMission({
      agencyId: data.agencyId,
      userId: currentUser.userId,
      entityType: EntityTypeEnum.DRIVER_LEAVE,
      entityId: modifiedLeave.id,
      titleKey: "DriverLeaveAdded.Title",
      titleObject: {
        driverName: modifiedLeave.driverName,
      },
      messageKey: "DriverLeaveAdded.Message",
      messageObject: {
        startDate: format(modifiedLeave.startDate, "dd MMM yyyy"),
        endDate: format(modifiedLeave.endDate, "dd MMM yyyy"),
      },
      dueDate: modifiedLeave.startDate,
      link: `/dashboard/drivers/${modifiedLeave.driverId}/leaves`,
    })
  }

  return modifiedLeave
}
