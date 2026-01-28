"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changePasswordAction(
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
  return true
}
