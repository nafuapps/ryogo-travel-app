"use server"

import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function activateDriverAction(
  id: string,
  userId: string,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  const driver = await driverServices.activateDriver(id, userId)
  if (!driver) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: driver.id,
    isFeed: true,
    textKey: "DriverActivated",
    textObject: {
      driverName: driver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${driver.id}`,
  })

  await missionServices.addMission({
    agencyId: agencyId,
    userId: driver.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: driver.id,
    titleKey: "DriverActivated.Title",
    titleObject: {
      userName: currentUser.name,
    },
    messageKey: "DriverActivated.Message",
    isCritical: true,
    link: `/rider/myProfile`,
  })

  return driver
}
