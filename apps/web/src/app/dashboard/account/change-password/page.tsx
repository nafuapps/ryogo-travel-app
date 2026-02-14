//Change password flow

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "../../components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ChangePasswordAccountComponent from "./changePassword"

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
