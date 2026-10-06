"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
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
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const user = await userServices.changeEmailWithPasswordConfirmation({
    userId,
    password,
    email,
  })

  if (!user) return

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

  return user
}
