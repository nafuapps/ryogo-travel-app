"use server"

import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeUserPhoneAction(
  userId: string,
  email: string,
  agencyId: string,
  role?: UserRolesEnum,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  const user = await userServices.changeUserPhone(userId, email, role)
  return user
}
