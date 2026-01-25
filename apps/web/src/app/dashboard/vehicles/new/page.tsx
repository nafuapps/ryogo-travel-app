//Vehicles/new page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../../components/extra/dashboardHeader"
import NewVehiclePageComponent from "./newVehicle"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export default async function NewVehiclePage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/new"} />
      <NewVehiclePageComponent agencyId={currentUser.agencyId} />
    </div>
  )
}
