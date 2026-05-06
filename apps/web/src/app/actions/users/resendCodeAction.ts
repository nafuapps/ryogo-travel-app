"use server"

import { resendCodeEmailTemplate } from "@/components/email/resendCodeEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

//Verify account flow
export async function resendCodeAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.userRole !== UserRolesEnum.OWNER) {
    return
  }
  const user = await userServices.regenerateCode(currentUser.userId)
  if (!user) return

  //Send new code to the user
  sendEmail(
    [user.email],
    "RyoGo Owner Account Verification Code",
    resendCodeEmailTemplate({ name: user.name, code: user.code }),
  )

  return user
}
