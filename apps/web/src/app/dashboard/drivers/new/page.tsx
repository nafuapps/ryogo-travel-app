//Drivers/new page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../../components/extra/dashboardHeader"
import NewDriverPageComponent from "./newDriver"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export default async function NewDriverPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/new"} />
      <NewDriverPageComponent agencyId={currentUser.agencyId} />
    </div>
  )
}
