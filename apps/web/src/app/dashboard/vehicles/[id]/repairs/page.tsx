//Vehicle Repairs page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import AllVehicleRepairsPageComponent from "./allVehicleRepairs"

export default async function AllVehicleRepairsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vehicleRepairs = await vehicleServices.findAllVehicleRepairsByVehicleId(
    id
  )

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/repairs"} />
      <AllVehicleRepairsPageComponent repairs={vehicleRepairs} />
    </div>
  )
}
