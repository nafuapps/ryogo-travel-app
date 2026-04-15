//Vehicles/id/modify page

import DashboardHeader from "@/app/dashboard/components/common/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyVehiclePageComponent from "./modifyVehicle"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Modify Vehicle - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function ModifyVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const vehicle = await vehicleServices.findVehicleDetailsById(id)
  if (!vehicle) {
    redirect("/dashboard/vehicles", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/modify"} />
      <ModifyVehiclePageComponent vehicle={vehicle} />
    </div>
  )
}
