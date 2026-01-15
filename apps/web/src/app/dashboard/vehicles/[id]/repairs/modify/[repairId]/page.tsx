//Modify Vehicle repair page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyVehicleRepairPageComponent from "./modifyVehicleRepair"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { VehicleRepairRegex } from "@/lib/regex"
import { redirect, RedirectType } from "next/navigation"

export default async function ModifyVehicleRepairPage({
  params,
}: {
  params: Promise<{ id: string; repairId: string }>
}) {
  const { id, repairId } = await params

  //Invalid repair id regex check
  if (!VehicleRepairRegex.safeParse(repairId).success) {
    redirect(`/dashboard/vehicles/${id}/repairs`, RedirectType.replace)
  }

  const repair = await vehicleServices.findVehicleRepairById(repairId)

  //Can anyone modify repair?

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/repairs/modify"} />
      <ModifyVehicleRepairPageComponent repair={repair} />
    </div>
  )
}
