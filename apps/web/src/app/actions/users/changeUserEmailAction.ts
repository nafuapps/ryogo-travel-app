"use server"

import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeUserEmailAction(
  userId: string,
  agencyId: string,
  email: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  const user = await userServices.changeUserEmail(userId, email)
  return user
}
