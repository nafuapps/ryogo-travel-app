"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ModifyDriverRequestType } from "@ryogo-travel-app/api/types/driver.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function modifyDriverAction(data: ModifyDriverRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (UserRolesEnum.OWNER !== currentUser.userRole &&
      data.addedByUserId !== currentUser.userId) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const driver = await driverServices.modifyDriver(data)
  if (!driver) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: driver.id,
    isFeed: true,
    textKey: "DriverModified",
    textObject: {
      driverName: driver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${driver.id}`,
  })

  return driver
}
