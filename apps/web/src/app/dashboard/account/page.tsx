//Account page

import DashboardHeader from "../components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import AccountPageComponent from "./account"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export default async function AccountPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const userDetails = await userServices.findUserDetailsById(currentUser.userId)

  if (!userDetails) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account"} />
      <AccountPageComponent userDetails={userDetails} />
    </div>
  )
}
