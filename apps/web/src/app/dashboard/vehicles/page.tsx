import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import DashboardHeader from "../components/common/dashboardHeader"
import VehiclesPageComponent from "./vehicles"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Vehicles - ${pageTitle}`,
  description: pageDescription,
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
