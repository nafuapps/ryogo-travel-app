"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function inactivateUserAction(id: string) {
  const user = await userServices.inactivateUser(id)
  if (!user) return false
  return true
}
