"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function activateUserAction(
  id: string,
  agencyId: string,
  role: UserRolesEnum,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const user = await userServices.activateUser(id, role)
  if (!user) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: id,
    textKey: "UserActivated",
    textObject: {
      userName: user.name,
      adminName: currentUser.name,
    },
    link: `/dashboard/users/${id}`,
  })

  await missionServices.removePreviousMissionsByEntityTitleKey(
    agencyId,
    EntityTypeEnum.DRIVER,
    user.id,
    "UserInactivated.Title",
  )
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
