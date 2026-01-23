//All vehicles page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../components/extra/dashboardHeader"
import VehiclesPageComponent from "./vehicles"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export default async function AllVehiclesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = user.agencyId
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles"} />
      <VehiclesPageComponent agencyId={agencyId} />
    </div>
  )
}
