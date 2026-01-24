//Users/id/modify page (only accessible to owner)

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ChangeUserEmailPageComponent from "./changeUserEmail"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"

export default async function ChangeUserEmailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const user = await userServices.findUserDetailsById(id)
  if (!user) {
    redirect("/dashboard/users", RedirectType.replace)
  }

  //Get all users with this user's role and phone
  const allUsers = await userServices.findUserAccountsByPhoneRole(
    user.phone,
    user.userRole,
  )

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users/[id]/change-email"} />
      <ChangeUserEmailPageComponent user={user} allUsers={allUsers} />
    </div>
  )
}
