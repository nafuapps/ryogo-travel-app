"use server"

import { getCurrentUser } from "@/lib/auth"
import { updateSessionUserStatus } from "@/lib/session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changePasswordAction(
  userId: string,
  agencyId: string,
  oldPassword: string,
  newPassword: string,
  activateUser?: boolean,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  const user = await userServices.changeMyPassword(
    userId,
    oldPassword,
    newPassword,
  )
  if (!user) return

  if (activateUser) {
    //Update user status in cookies
    const updatedUser = await userServices.activateUser(userId)
    if (!updatedUser) return false

    await updateSessionUserStatus(updatedUser.status)
  }
  return user
}
