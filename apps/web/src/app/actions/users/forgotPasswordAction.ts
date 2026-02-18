"use server"

import { ResetPasswordEmailTemplate } from "@/components/email/resetPasswordEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect } from "next/navigation"

export async function forgotPasswordAction(userId: string) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider")
    } else {
      redirect("/dashboard")
    }
  }
  const user = await userServices.resetUserPassword(userId)
  if (!user) return

  //Send password reset email to the user
  sendEmail(
    [user.email],
    "Password Reset successful",
    ResetPasswordEmailTemplate({ name: user.name, password: user.password }),
  )
  return user
}
