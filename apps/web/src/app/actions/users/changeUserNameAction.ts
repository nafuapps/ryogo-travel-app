"use server"

import { writePermissions } from "@/lib/permissions"
import { updateUserNameInWebSession } from "@/lib/session"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeUserNameAction({
  userId,
  agencyId,
  name,
  userRole,
  addedByUserId,
}: {
  userId: string
  agencyId: string
  name: string
  userRole: UserRolesEnum
  addedByUserId?: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId,
    assignedUserId: addedByUserId ?? userId,
  })
  if (!currentUser) return

  const changedUser = await userServices.changeName({ userId, name, userRole })
  if (!changedUser) return

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

  if (currentUser.userId === userId) {
    //Change name in cookie
    await updateUserNameInWebSession(name)
  }

  return changedUser
}
