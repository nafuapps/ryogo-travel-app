"use server"

import { writePermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function activateUserAction({
  userId,
  agencyId,
  role,
}: {
  userId: string
  agencyId: string
  role: UserRolesEnum
}) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) return

  const user = await userServices.activateUser({ userId, role })
  if (!user) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: userId,
    textKey: "UserActivated",
    textObject: {
      userName: user.name,
      adminName: currentUser.name,
    },
    link: `/dashboard/users/${userId}`,
  })

  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: user.id,
    titleKey: "UserInactivated.Title",
  })
  await missionServices.addMission({
    agencyId: agencyId,
    userId: user.id,
    entityType: EntityTypeEnum.DRIVER,
    entityId: user.id,
    titleKey: "UserActivated.Title",
    titleObject: {
      userName: currentUser.name,
    },
    messageKey: "UserActivated.Message",
    isCritical: true,
    link:
      role === UserRolesEnum.DRIVER ? `/rider/myProfile` : `/dashboard/account`,
  })

  return user
}
