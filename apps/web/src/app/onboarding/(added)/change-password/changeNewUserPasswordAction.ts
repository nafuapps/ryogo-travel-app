"use server"

import { updateSessionUserStatus } from "@/lib/session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changeNewUserPasswordAction(
  userId: string,
  oldPassword: string,
  newPassword: string,
) {
  const user = await userServices.changePassword(
    userId,
    oldPassword,
    newPassword,
  )
  if (!user) return false

  //Update user status in cookies
  const updatedUser = await userServices.activateUser(userId)
  if (!updatedUser) return false

  await updateSessionUserStatus(updatedUser.status)
  return true
}
