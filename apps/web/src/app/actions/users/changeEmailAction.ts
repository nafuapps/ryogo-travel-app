"use server"

import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function changeEmailAction(
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
  const user = await userServices.changeEmailWithPasswordConfirmation(
    userId,
    password,
    newEmail,
  )
  return user
}
