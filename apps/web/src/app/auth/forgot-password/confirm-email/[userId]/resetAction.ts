"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function resetAction(userId: string) {
  const resetData = await userServices.resetUserPassword(userId)
  return resetData
}
