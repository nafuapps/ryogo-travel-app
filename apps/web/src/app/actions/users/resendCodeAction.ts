"use server"

import { resendCodeEmailTemplate } from "@/components/email/resendCodeEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function resendCodeAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return
  }
  const user = await userServices.regenerateVerificationCode(currentUser.userId)
  if (!user) return

  //Send new code to the user
  sendEmail(
    [user.email],
    "RyoGo Verification Code",
    resendCodeEmailTemplate({ name: user.name, code: user.code }),
  )

  return user
}
