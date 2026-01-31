"use server"

import { ResetPasswordEmailTemplate } from "@/components/email/resetPasswordEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function resetUserPasswordAction(userId: string) {
  const user = await userServices.resetUserPassword(userId)
  if (!user) return false

  //Send password reset email to the user
  sendEmail(
    [user.email],
    "Password Reset successful",
    ResetPasswordEmailTemplate({ name: user.name, password: user.password }),
  )

  if (!user) return false
  return true
}
