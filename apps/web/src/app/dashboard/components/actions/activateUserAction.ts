"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function activateUserAction(id: string) {
  const user = await userServices.activateUser(id)
  if (!user) return false
  return true
}
