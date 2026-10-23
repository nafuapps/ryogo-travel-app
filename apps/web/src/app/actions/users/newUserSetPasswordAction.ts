"use server"

import { writePermissions } from "@/lib/permissions"
import {
  updateUserStatusInWebSession,
  updateUserVerificationInWebSession,
} from "@/lib/session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function newUserSetPasswordAction({
  userId,
  agencyId,
  newPassword,
}: {
  userId: string
  agencyId: string
  newPassword: string
}) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) {
    return
  }

  const changedUser = await userServices.verifyUserAndSetNewPassword({
    userId,
    newPassword,
  })
  if (!changedUser) return

  // Update verification status to true in cookies
  await updateUserVerificationInWebSession(changedUser.isVerified)

  // Update user status to active in cookies
  await updateUserStatusInWebSession(changedUser.status)

  return changedUser
}
