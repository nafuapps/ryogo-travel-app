//Login password page

import { Metadata } from "next"
import LoginPasswordPageComponent from "./loginPassword"
import { UserRegex } from "@/lib/regex"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: "Login with Password - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function LoginPasswordPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const userId = (await params).userId

  if (!UserRegex.safeParse(userId).success) {
    redirect("/auth/login", RedirectType.replace)
  }
  return <LoginPasswordPageComponent userId={userId} />
}
