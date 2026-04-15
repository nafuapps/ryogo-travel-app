//Vehicles/new page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../../components/common/dashboardHeader"
import NewVehiclePageComponent from "./newVehicle"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Vehicle - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

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
