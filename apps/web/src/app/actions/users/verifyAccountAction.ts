"use server"

import { getCurrentUser } from "@/lib/auth"
import { updateVerificationStatus } from "@/lib/session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function verifyAccountAction(code: string) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return
  }
  const user = await userServices.verifyUser(currentUser.userId, code)
  if (!user || !user.isVerified) return

  //Update verification in session cookie
  await updateVerificationStatus(true)

  return user
}
