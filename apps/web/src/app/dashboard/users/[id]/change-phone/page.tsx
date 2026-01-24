//Users/id/modify page (only accessible to owner)

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ChangeUserPhonePageComponent from "./changeUserPhone"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"

export default async function ChangeUserPhonePage({
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

  //Get all users with this user's role
  const allUsers = await userServices.findAllUsersByRole([user.userRole])

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users/[id]/change-phone"} />
      <ChangeUserPhonePageComponent user={user} allUsers={allUsers} />
    </div>
  )
}
