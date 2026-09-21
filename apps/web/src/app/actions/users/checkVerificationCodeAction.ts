"use server"

import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function checkVerificationCodeAction(
  code: string,
  userId?: string,
) {
  let currentUserId = userId

  //If no userId is passed (logged in user), get it from cookies
  if (!currentUserId) {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return
    }
    currentUserId = currentUser.userId
  }

  const result = await userServices.checkVerificationCode(currentUserId, code)

  return result
}
