//Login Accounts page
import { Metadata } from "next"
import LoginAccountsPageComponent from "./loginAccounts"
import { PhoneRegex } from "@/lib/regex"
import { redirect, RedirectType } from "next/navigation"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export const metadata: Metadata = {
  title: "Login Accounts - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function LoginAccountsPage({
  params,
}: {
  params: Promise<{ phone: string }>
}) {
  const { phone } = await params
  if (!PhoneRegex.safeParse(phone).success) {
    redirect("/auth/login", RedirectType.replace)
  }

  const accounts = await userServices.findUserAccountsByPhone(phone)
  if (accounts.length < 1) {
    redirect("/auth/login", RedirectType.replace)
  }
  return <LoginAccountsPageComponent accounts={accounts} />
}
