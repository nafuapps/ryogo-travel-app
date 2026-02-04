//Add a new vehicle repair page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import NewVehicleRepairPageComponent from "./newVehicleRepair"
import { redirect, RedirectType } from "next/navigation"

export default async function NewVehicleRepairPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/repairs/new"} />
      <NewVehicleRepairPageComponent
        userId={user.userId}
        agencyId={user.agencyId}
        vehicleId={id}
      />
    </div>
  )
}
