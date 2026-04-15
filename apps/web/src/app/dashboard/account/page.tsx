//Account page

import DashboardHeader from "../components/common/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import AccountPageComponent from "./account"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

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
