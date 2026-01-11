//Modify Vehicle leave page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyVehicleRepairPageComponent from "./modifyVehicleRepair"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"

export default async function ModifyVehicleRepairPage({
  params,
}: {
  params: Promise<{ id: string; repairId: string }>
}) {
  const { repairId } = await params

  const repair = await vehicleServices.findVehicleRepairById(repairId)

  //Can anyone modify repair?

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/repairs/modify"} />
      <ModifyVehicleRepairPageComponent repair={repair} />
    </div>
  )
}
