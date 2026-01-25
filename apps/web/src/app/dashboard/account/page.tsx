//Account page

import DashboardHeader from "../components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import AccountPageComponent from "./account"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export default async function AccountPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account"} />
      <AccountPageComponent userId={currentUser.userId} />
    </div>
  )
}
