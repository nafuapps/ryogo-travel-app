"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeUserNameAction(
  userId: string,
  name: string,
  role: UserRolesEnum,
) {
  const user = await userServices.changeName(userId, name, role)

  if (!user) return false
  return true
}
