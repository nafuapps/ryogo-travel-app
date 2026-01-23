//All Drivers page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../components/extra/dashboardHeader"
import DriversPageComponent from "./drivers"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export default async function AllDriversPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = user.agencyId
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers"} />
      <DriversPageComponent agencyId={agencyId} />
    </div>
  )
}
