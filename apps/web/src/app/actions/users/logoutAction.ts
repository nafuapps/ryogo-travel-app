"use server"

import { getCurrentUser, logout, verifyCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export async function logoutAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const logoutResult = await logout()
  if (!logoutResult) {
    return
  }

  await notificationServices.addNotification({
    agencyId: logoutResult.agencyId,
    userId: logoutResult.id,
    entityType: EntityTypeEnum.USER,
    entityId: logoutResult.id,
    textKey: "UserLoggedOut",
    textObject: {
      userName: logoutResult.name,
    },
    link: `/dashboard/users/${logoutResult.id}`,
  })

  redirect("/auth/login", RedirectType.replace)
}
