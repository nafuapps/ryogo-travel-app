"use server"

import { ResetPasswordEmailTemplate } from "@/components/email/resetPasswordEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function resetUserPasswordAction(
  userId: string,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== userId) ||
    currentUser.agencyId !== agencyId
  ) {
    return
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
