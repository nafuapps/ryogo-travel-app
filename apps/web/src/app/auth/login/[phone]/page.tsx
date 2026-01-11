//Login Accounts page
import { Metadata } from "next"
import LoginAccountsPageComponent from "./loginAccounts"
import { PhoneRegex } from "@/lib/regex"
import { redirect, RedirectType } from "next/navigation"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export const metadata: Metadata = {
  title: "Login Accounts Page | RyoGo",
  description: "Login Accounts page for RyoGo Travel App",
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

  return <LoginAccountsPageComponent accounts={accounts} />
}
