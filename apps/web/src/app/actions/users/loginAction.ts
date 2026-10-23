"use server"

import { login } from "@/lib/auth"
import { readPermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function loginAction({
  userId,
  password,
}: {
  userId: string
  password: string
}) {
  await readPermissions.redirectIfAuthenticated()

  const loginResult = await login({ userId, password })
  if (loginResult.error) {
    return loginResult
  }

  if (loginResult.data) {
    await notificationServices.addNotification({
      agencyId: loginResult.data.agencyId,
      userId: userId,
      entityType: EntityTypeEnum.USER,
      entityId: userId,
      textKey: "UserLoggedIn",
      textObject: {
        userName: loginResult.data.name,
      },
      link: `/dashboard/users/${userId}`,
    })
    return loginResult
  }

  return loginResult
}
