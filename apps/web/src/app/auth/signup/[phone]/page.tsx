//Existing Account page
import { Metadata } from "next"
import { PhoneRegex } from "@/lib/regex"
import { redirect, RedirectType } from "next/navigation"
import SignupExistingPageComponent from "./signupExisting"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export const metadata: Metadata = {
  title: "Signup Existing Accounts Page | RyoGo",
  description: "Signup Existing Accounts page for RyoGo Travel App",
}

export default async function SignupExistingPage({
  params,
}: {
  params: Promise<{ phone: string }>
}) {
  const { phone } = await params

  // If phone number not legible, redirect back to signup page
  if (!PhoneRegex.safeParse(phone).success) {
    redirect("/auth/signup", RedirectType.replace)
  }
  const accounts = await userServices.findUserAccountsByPhone(phone)

  return <SignupExistingPageComponent accounts={accounts} />
}
