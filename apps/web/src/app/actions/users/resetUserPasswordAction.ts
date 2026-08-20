"use server"

import { ResetPasswordEmailTemplate } from "@/components/email/resetPasswordEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

//Owner resetting user's password flow
export async function resetUserPasswordAction(
  userId: string,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const user = await userServices.resetUserPassword(userId)
  if (!user) return

  //Send password reset email to the user
  sendEmail({
    receipientEmail: [user.email],
    subject: "Password Reset successful",
    element: ResetPasswordEmailTemplate({
      name: user.name,
      password: user.password,
    }),
  })
  return user
}
