"use server"

import { resendCodeEmailTemplate } from "@/components/email/resendCodeEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { writePermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

//Verify account flow
export async function resendVerificationCodeAction(agencyId: string) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser || !currentUser.isAdmin) {
    return
  }

  const changedUser = await userServices.regenerateCode(currentUser.userId)
  if (!changedUser || !changedUser.verificationCode) return

  //Send new code to the user
  await sendEmail({
    receipientEmail: [changedUser.email],
    subject: "RyoGo Account Verification Code",
    element: resendCodeEmailTemplate({
      name: changedUser.name,
      code: changedUser.verificationCode,
    }),
  })

  return changedUser
}
