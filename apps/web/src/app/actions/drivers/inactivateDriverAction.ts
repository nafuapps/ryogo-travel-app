"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function inactivateDriverAction({
  driverId,
  agencyId,
}: {
  driverId: string
  agencyId: string
}) {
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

  if (!(await verifyCurrentUser())) {
    return
  }

  const driver = await driverServices.inactivateDriver(driverId)
  if (!driver) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
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

  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId,
    entityType: EntityTypeEnum.USER,
    entityId: driver.userId,
    titleKey: "UserActivated.Title",
  })
  await missionServices.addMission({
    agencyId: agencyId,
    userId: driver.userId,
    entityType: EntityTypeEnum.USER,
    entityId: driver.userId,
    titleKey: "UserInactivated.Title",
    titleObject: {
      userName: currentUser.name,
    },
    messageKey: "UserInactivated.Message",
    isCritical: true,
    link: `/rider/myProfile`,
  })

  return driver
}
