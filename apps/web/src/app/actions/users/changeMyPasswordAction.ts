"use server"

import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changeMyPasswordAction(
  userId: string,
  agencyId: string,
  oldPassword: string,
  newPassword: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  const user = await userServices.changeMyPassword(
    userId,
    oldPassword,
    newPassword,
  )
  if (!user) return
  return user
}
