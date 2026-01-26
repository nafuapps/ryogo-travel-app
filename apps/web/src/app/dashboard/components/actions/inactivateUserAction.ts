"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function inactivateUserAction(id: string, role?: UserRolesEnum) {
  const user = await userServices.inactivateUser(id, role)
  if (!user) return false
  return true
}
