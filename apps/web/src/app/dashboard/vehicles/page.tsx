//All vehicles page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../components/common/dashboardHeader"
import VehiclesPageComponent from "./vehicles"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vehicles - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

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
