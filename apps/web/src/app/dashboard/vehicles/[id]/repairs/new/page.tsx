//Add a new vehicle repair page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import NewVehicleRepairPageComponent from "./newVehicleRepair"

export default async function NewVehicleRepairPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicle/[id]/repairs/new"} />
      <NewVehicleRepairPageComponent
        userId={user!.userId}
        agencyId={user!.agencyId}
        vehicleId={id}
      />
    </div>
  )
}
