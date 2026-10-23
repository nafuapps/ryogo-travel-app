"use server"

import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function checkVerificationCodeAction({
  code,
  userId,
  loggedIn,
}: {
  code: string
  userId: string
  loggedIn?: boolean
}) {
  if (loggedIn) {
    const currentUser = await readPermissions.getAuthenticatedUser()
    if (currentUser.userId !== userId) {
      return
    }
  } else {
    await readPermissions.redirectIfAuthenticated()
  }

  const result = await userServices.checkVerificationCode({
    userId,
    code,
  })

  return result
}
