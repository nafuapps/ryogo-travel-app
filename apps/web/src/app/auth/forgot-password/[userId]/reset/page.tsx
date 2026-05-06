//Confirm Email page

import { redirect, RedirectType } from "next/navigation"
import { UserRegex } from "@/lib/regex"
import { Metadata } from "next"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import ResetWithCodePageComponent from "./resetWithCode"

export const metadata: Metadata = {
  title: `Reset Password - ${pageTitle}`,
  description: pageDescription,
}

export default async function VerifyCodePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const userId = (await params).userId

  if (!UserRegex.safeParse(userId).success) {
    redirect("/auth/login", RedirectType.replace)
  }

  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <ResetWithCodePageComponent
      userId={userId}
      verificationCode={user.verificationCode}
    />
  )
}
