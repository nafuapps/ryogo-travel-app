"use server"

import { ForgotPasswordCodeTemplate } from "@/components/email/forgotPasswordCodeTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function forgotPasswordAction(userId: string, link: string) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider")
    } else {
      redirect("/dashboard")
    }
  }
  const user = await userServices.generateAndSendCode(userId)
  if (!user) return

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const absoluteUrl = `${protocol}://${host}${link}`

  //Send password reset code email to the user
  sendEmail(
    [user.email],
    "RyoGo verification code for password reset",
    ForgotPasswordCodeTemplate({
      name: user.name,
      code: user.code,
      link: absoluteUrl,
    }),
  )
  return user
}
