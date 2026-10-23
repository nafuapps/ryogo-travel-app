"use server"

import { writePermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function inactivateUserAction({
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

  const inactivatedUser = await userServices.inactivateUser({ userId, role })
  if (!inactivatedUser) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: userId,
    textKey: "UserInactivated",
    textObject: {
      userName: inactivatedUser.name,
      adminName: currentUser.name,
    },
    link: `/dashboard/users/${userId}`,
  })

  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId,
    entityType: EntityTypeEnum.USER,
    entityId: inactivatedUser.id,
    titleKey: "UserActivated.Title",
  })
  await missionServices.addMission({
    agencyId: agencyId,
    userId: inactivatedUser.id,
    entityType: EntityTypeEnum.USER,
    entityId: inactivatedUser.id,
    titleKey: "UserInactivated.Title",
    titleObject: {
      userName: currentUser.name,
    },
    messageKey: "UserInactivated.Message",
    isCritical: true,
    link:
      role === UserRolesEnum.DRIVER ? `/rider/myProfile` : `/dashboard/account`,
  })

  return inactivatedUser
}
