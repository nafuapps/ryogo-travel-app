"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changeUserEmailAction(userId: string, email: string) {
  const user = await userServices.changeUserEmail(userId, email)

  if (!user) return false
  return true
}
