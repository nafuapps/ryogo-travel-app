//Change email flow

import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "../../components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ChangeEmailAccountComponent from "./changeEmail"

export default async function ChangeEmailAccountPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const usersWithPhoneRole = await userServices.findUserAccountsByPhoneRole(
    user.phone,
    user.userRole,
  )
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account/change-email"} />
      <ChangeEmailAccountComponent
        usersWithPhoneRole={usersWithPhoneRole}
        userId={user.userId}
      />
    </div>
  )
}
