"use server"

import { login } from "@/lib/auth"
import { readPermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

//Forgot password reset flow (by user)
export async function resetMyPasswordAction({
  userId,
  newPassword,
  code,
}: {
  userId: string
  newPassword: string
  code: string
}) {
  await readPermissions.redirectIfAuthenticated()

  const user = await userServices.resetMyPassword({
    userId,
    newPassword,
    code,
  })
  if (!user) return

  const loginResult = await login({ userId: user.id, password: newPassword })
  if (!loginResult.data) return

  await notificationServices.addNotification({
    agencyId: user.agencyId,
    userId: userId,
    entityType: EntityTypeEnum.USER,
    entityId: userId,
    textKey: "ResetPassword",
    textObject: {
      userName: user.name,
    },
    link: `/dashboard/users/${userId}`,
  })

  return user
}
