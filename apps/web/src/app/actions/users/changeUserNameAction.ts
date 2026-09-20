"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeUserNameAction(
  userId: string,
  agencyId: string,
  name: string,
  role: UserRolesEnum,
  addedByUserId?: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== userId &&
      currentUser.userId !== addedByUserId) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const user = await userServices.changeName(userId, name, role)
  if (!user) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: userId,
    textKey: currentUser.userId === userId ? "ChangedName" : "UserNameChanged",
    textObject: {
      newName: name,
      userName: currentUser.name,
    },
  })

  return user
}
