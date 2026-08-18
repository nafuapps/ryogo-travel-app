"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { updateUserAdminInWebSession } from "@/lib/session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function transferAdminAction(
  currentUserId: string,
  otherUserId: string,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    !currentUser.isAdmin ||
    currentUser.userId !== currentUserId ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const user = await userServices.transferAdmin(
    currentUserId,
    otherUserId,
    agencyId,
  )

  if (!user) {
    return
  }

  await updateUserAdminInWebSession(false)

  return user
}
