"use server"

import { updateSessionUserStatus } from "@/lib/session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changePasswordAction(
  userId: string,
  oldPassword: string,
  newPassword: string,
  activateUser?: boolean,
) {
  const user = await userServices.changePassword(
    userId,
    oldPassword,
    newPassword,
  )
  if (!user) return false

  if (activateUser) {
    //Update user status in cookies
    const updatedUser = await userServices.activateUser(userId)
    if (!updatedUser) return false

    await updateSessionUserStatus(updatedUser.status)
  }
  return true
}
