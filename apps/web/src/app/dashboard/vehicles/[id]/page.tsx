//Vehicles/id (details) page

import VehicleDetailsPageComponent from "./vehicleDetails"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "../../components/extra/dashboardHeader"
import { redirect, RedirectType } from "next/navigation"

export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getCurrentUser()

  const vehicle = await vehicleServices.findVehicleDetailsById(id)

  if (!user || !vehicle || user.agencyId != vehicle.agencyId) {
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]"} />
      <VehicleDetailsPageComponent vehicle={vehicle} />
    </div>
  )
}
