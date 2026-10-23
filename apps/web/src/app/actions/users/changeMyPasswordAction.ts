"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function changeMyPasswordAction({
  userId,
  agencyId,
  oldPassword,
  newPassword,
}: {
  userId: string
  agencyId: string
  oldPassword: string
  newPassword: string
}) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const changedUser = await userServices.changeMyPassword({
    userId,
    oldPassword,
    newPassword,
  })
  if (!changedUser) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: userId,
    textKey: "ChangedPassword",
    textObject: {
      userName: currentUser.name,
    },
    link: `/dashboard/users/${userId}`,
  })

  return changedUser
}
