"use server"

import { login, getCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect } from "next/navigation"

//Forgot password reset flow
export async function setNewPasswordAction({
  userId,
  newPassword,
}: {
  userId: string
  newPassword: string
}) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider/home")
    } else {
      redirect("/dashboard/home")
    }
  }

  const user = await userServices.changeNewPassword({
    userId,
    newPassword,
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
