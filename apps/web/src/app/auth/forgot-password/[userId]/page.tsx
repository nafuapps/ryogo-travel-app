//Confirm Email page

import { redirect, RedirectType } from "next/navigation"
import ForgotPasswordPageComponent from "./forgotPassword"
import { Metadata } from "next"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"

export const metadata: Metadata = {
  title: `Forgot Password - ${pageTitle}`,
  description: pageDescription,
}

export default async function ConfirmEmailPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  return <ForgotPasswordPageComponent user={user} />
}
