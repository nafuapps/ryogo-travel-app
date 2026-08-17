"use server"

import { resendCodeEmailTemplate } from "@/components/email/resendCodeEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

//Verify account flow
export async function resendVerificationCodeAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.userRole !== UserRolesEnum.OWNER) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const user = await userServices.regenerateCode(currentUser.userId)
  if (!user) return

  //Send new code to the user
  sendEmail({
    receipientEmail: [user.email],
    subject: "RyoGo Account Verification Code",
    element: resendCodeEmailTemplate({ name: user.name, code: user.code }),
  })

  return user
}
