"use server"

import { getCurrentUser } from "@/lib/auth"
import {
  updateUserStatusInWebSession,
  updateUserVerificationInWebSession,
} from "@/lib/session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function newUserSetPasswordAction(
  userId: string,
  agencyId: string,
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
  const user = await userServices.setNewPassword(userId, newPassword)
  if (!user) return

  // Update user status to active in cookies
  await updateUserStatusInWebSession(user.status)

  // Update verification status to true in cookies
  await updateUserVerificationInWebSession(user.isVerified)

  return user
}
