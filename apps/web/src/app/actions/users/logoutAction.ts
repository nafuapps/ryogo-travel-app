"use server"

import { logout } from "@/lib/auth"
import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export async function logoutAction() {
  const currentUser = await writePermissions.allowAllUsers()
  if (!currentUser) {
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
