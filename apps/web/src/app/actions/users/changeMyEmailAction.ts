"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changeMyEmailAction(
  userId: string,
  password: string,
  newEmail: string,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const user = await userServices.changeEmailWithPasswordConfirmation(
    userId,
    password,
    newEmail,
  )
  return user
}
