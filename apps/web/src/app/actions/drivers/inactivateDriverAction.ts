"use server"

import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function inactivateDriverAction(id: string, agencyId: string) {
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
  const driver = await driverServices.inactivateDriver(id)
  if (!driver) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: driver.id,
    isFeed: true,
    textKey: "DriverInactivated",
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
    titleKey: "DriverInactivated.Title",
    titleObject: {
      userName: currentUser.name,
    },
    messageKey: "DriverInactivated.Message",
    isCritical: true,
    link: `/rider/myProfile`,
  })

  return driver
}
