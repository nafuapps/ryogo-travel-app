"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeUserPhoneAction(
  userId: string,
  email: string,
  role?: UserRolesEnum,
) {
  const user = await userServices.changeUserPhone(userId, email, role)

  if (!user) return false
  return true
}
