//Users/id (details) page (only accesssible by owner)

import { mainClassName } from "@/components/page/pageCommons"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "../../components/extra/dashboardHeader"
import UserDetailsPageComponent from "./userDetails"
import { redirect, RedirectType } from "next/navigation"

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await userServices.findUserDetailsById(id)
  if (!user) {
    redirect("/dashboard/users", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users/[id]"} />
      <UserDetailsPageComponent user={user} />
    </div>
  )
}
