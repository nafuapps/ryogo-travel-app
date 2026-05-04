//Existing Account page
import { Metadata } from "next"
import { PhoneRegex } from "@/lib/regex"
import { redirect, RedirectType } from "next/navigation"
import SignupExistingPageComponent from "./signupExisting"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"

export const metadata: Metadata = {
  title: `Signup Accounts - ${pageTitle}`,
  description: pageDescription,
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

  //If not accounts found, go for onboarding
  if (accounts.length < 1) {
    redirect("/onboarding", RedirectType.replace)
  }

  return <SignupExistingPageComponent accounts={accounts} />
}
