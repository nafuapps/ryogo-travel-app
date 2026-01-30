"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changeEmailAction(
  userId: string,
  password: string,
  newEmail: string,
) {
  const user = await userServices.changeEmail(userId, password, newEmail)
  if (!user) return false
  return true
}
