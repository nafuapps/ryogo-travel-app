//All Users page (only accesssible by owner)

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "../components/extra/dashboardHeader"
import UsersPageComponent from "./users"

export default async function AllUsersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = currentUser.agencyId
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users"} />
      <UsersPageComponent agencyId={agencyId} />
    </div>
  )
}
