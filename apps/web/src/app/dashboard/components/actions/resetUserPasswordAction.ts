"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function resetUserPasswordAction(userId: string) {
  const user = await userServices.resetUserPassword(userId)

  if (!user) return false
  return true
}
