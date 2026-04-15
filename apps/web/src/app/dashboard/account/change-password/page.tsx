//Change password flow

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "../../components/common/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ChangePasswordAccountComponent from "./changePassword"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Change Password - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function ChangePasswordAccountPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account/change-password"} />
      <ChangePasswordAccountComponent
        userId={user.userId}
        agencyId={user.agencyId}
      />
    </div>
  )
}
