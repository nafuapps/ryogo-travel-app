"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function findLoginUsersAction(phone: string) {
  const users = await userServices.findValidUsersByPhone(phone)
  return users
}
