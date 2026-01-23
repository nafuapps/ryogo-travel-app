"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changeNameAction(userId: string, name: string) {
  const user = await userServices.changeName(userId, name)

  if (!user) return false
  return true
}
