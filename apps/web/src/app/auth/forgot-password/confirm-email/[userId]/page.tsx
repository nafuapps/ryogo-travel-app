//Confirm Email page

import { redirect, RedirectType } from "next/navigation"
import { UserRegex } from "@/lib/regex"
import ConfirmEmailPageComponent from "./confirmEmail"
import { Metadata } from "next"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export const metadata: Metadata = {
  title: "Confirm Email Page | RyoGo",
  description: "Comfirm Email page for RyoGo Travel App",
}

export default async function ConfirmEmailPage({
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
    <ConfirmEmailPageComponent
      userId={userId}
      currentEmail={user.email}
      agencyId={user.agencyId}
    />
  )
}
