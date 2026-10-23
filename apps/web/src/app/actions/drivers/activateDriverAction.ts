"use server"

import { writePermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function activateDriverAction({
  agencyId,
  driverId,
  userId,
}: {
  driverId: string
  userId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) return

  const activatedDriver = await driverServices.activateDriver({
    driverId,
    userId,
  })
  if (!activatedDriver) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: activatedDriver.id,
    isFeed: true,
    textKey: "DriverActivated",
    textObject: {
      driverName: activatedDriver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${activatedDriver.id}`,
  })

  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId,
    entityType: EntityTypeEnum.USER,
    entityId: activatedDriver.userId,
    titleKey: "UserInactivated.Title",
  })
  await missionServices.addMission({
    agencyId: agencyId,
    userId: activatedDriver.userId,
    entityType: EntityTypeEnum.USER,
    entityId: activatedDriver.userId,
    titleKey: "UserActivated.Title",
    titleObject: {
      userName: currentUser.name,
    },
    messageKey: "UserActivated.Message",
    isCritical: true,
    link: `/rider/myProfile`,
  })

  return activatedDriver
}
