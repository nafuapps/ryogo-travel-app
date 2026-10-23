"use server"

import { ForgotPasswordCodeTemplate } from "@/components/email/forgotPasswordCodeTemplate"
import sendEmail from "@/components/email/sendEmail"
import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { headers } from "next/headers"

export async function forgotPasswordAction(userId: string) {
  await readPermissions.redirectIfAuthenticated()

  const user = await userServices.generateAndSendCode(userId)
  if (!user || !user.verificationCode) {
    return
  }

  const link = `/auth/forgot-password/${userId}/reset`

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const absoluteUrl = `${protocol}://${host}${link}`

  //Send password reset code email to the user
  await sendEmail({
    receipientEmail: [user.email],
    subject: "RyoGo verification code - Password reset",
    element: ForgotPasswordCodeTemplate({
      name: user.name,
      code: user.verificationCode,
      link: absoluteUrl,
    }),
  })
  return user
}
