"use server"

import { writePermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function inactivateDriverAction({
  driverId,
  agencyId,
  userId,
}: {
  driverId: string
  agencyId: string
  userId: string
}) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) return

  const inactivatedDriver = await driverServices.inactivateDriver({
    driverId,
    userId,
  })
  if (!inactivatedDriver) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: inactivatedDriver.id,
    isFeed: true,
    textKey: "DriverInactivated",
    textObject: {
      driverName: inactivatedDriver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${inactivatedDriver.id}`,
  })

  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId,
    entityType: EntityTypeEnum.USER,
    entityId: inactivatedDriver.userId,
    titleKey: "UserActivated.Title",
  })
  await missionServices.addMission({
    agencyId: agencyId,
    userId: inactivatedDriver.userId,
    entityType: EntityTypeEnum.USER,
    entityId: inactivatedDriver.userId,
    titleKey: "UserInactivated.Title",
    titleObject: {
      userName: currentUser.name,
    },
    messageKey: "UserInactivated.Message",
    isCritical: true,
    link: `/rider/myProfile`,
  })

  return inactivatedDriver
}
