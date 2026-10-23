"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function changeMyEmailAction({
  userId,
  password,
  email,
  agencyId,
}: {
  userId: string
  password: string
  email: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const changedUser = await userServices.changeEmailWithPasswordConfirmation({
    userId,
    password,
    email,
  })
  if (!changedUser) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: userId,
    textKey: "ChangedEmail",
    textObject: {
      newEmail: email,
      userName: currentUser.name,
    },
    link: `/dashboard/users/${userId}`,
  })

  return changedUser
}
