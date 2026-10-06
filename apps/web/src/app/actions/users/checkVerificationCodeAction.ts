"use server"

import { getCurrentUser } from "@/lib/auth"
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
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.userId !== userId) {
      return
    }
  }

  const result = await userServices.checkVerificationCode({
    userId,
    code,
  })

  return result
}
