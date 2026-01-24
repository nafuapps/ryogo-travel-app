//Users/new page (only accessible to owner)

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "../../components/extra/dashboardHeader"
import NewAgentPageComponent from "./newAgent"

export default async function NewUserPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = currentUser.agencyId
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users"} />
      <NewAgentPageComponent agencyId={agencyId} />
    </div>
  )
}
