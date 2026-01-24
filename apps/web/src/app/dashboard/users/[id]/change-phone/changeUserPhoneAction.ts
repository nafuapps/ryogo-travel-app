"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changeUserPhoneAction(userId: string, email: string) {
  const user = await userServices.changeUserPhone(userId, email)

  if (!user) return false
  return true
}
