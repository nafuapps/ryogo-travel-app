"use server"
import { getCurrentUser, login } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export async function loginAction(userId: string, password: string) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider/home", RedirectType.replace)
    }
    redirect("/dashboard/home", RedirectType.replace)
  }
  const loginResult = await login(userId, password)

  if ("id" in loginResult) {
    await notificationServices.addNotification({
      agencyId: loginResult.agencyId,
      userId: userId,
      entityType: EntityTypeEnum.USER,
      entityId: userId,
      textKey: "UserLoggedIn",
      textObject: {
        userName: loginResult.name,
      },
      link: `/dashboard/users/${userId}`,
    })
  }

  return loginResult
}
