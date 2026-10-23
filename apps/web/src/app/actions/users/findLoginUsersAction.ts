"use server"

import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function findLoginUsersAction(phone: string) {
  await readPermissions.redirectIfAuthenticated()

  const users = await userServices.findValidUsersByPhone(phone)
  return users
}
