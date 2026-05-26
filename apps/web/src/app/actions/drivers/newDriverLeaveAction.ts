"use server"

import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import {
  EntityTypeEnum,
  InsertDriverLeaveType,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"

export async function newDriverLeaveAction(data: InsertDriverLeaveType) {
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
  const leave = await driverServices.addDriverLeave(data)
  if (!leave) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: leave.driverId,
    isFeed: true,
    textKey: "DriverLeaveAdded",
    textObject: {
      driverName: leave.driverName,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${leave.driverId}/leaves`,
  })

  return leave
}
