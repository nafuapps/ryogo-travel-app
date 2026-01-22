//Vehicles/id/modify page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyVehiclePageComponent from "./modifyVehicle"
import { getCurrentUser } from "@/lib/auth"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { redirect, RedirectType } from "next/navigation"

export default async function ModifyVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const vehicle = await vehicleServices.findVehicleDetailsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/modify"} />
      <ModifyVehiclePageComponent vehicle={vehicle} />
    </div>
  )
}
