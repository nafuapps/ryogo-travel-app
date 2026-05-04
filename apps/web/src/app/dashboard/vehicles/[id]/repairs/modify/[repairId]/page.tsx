import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import ModifyVehicleRepairPageComponent from "./modifyVehicleRepair"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { VehicleRepairRegex } from "@/lib/regex"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Modify Vehicle Repair - ${pageTitle}`,
  description: pageDescription,
}

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

  //If no such repair found, redirect
  if (!repair) {
    redirect(`/dashboard/vehicles/${id}/repairs`, RedirectType.replace)
  }
  //Can anyone modify repair?

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/repairs/modify"} />
      <ModifyVehicleRepairPageComponent repair={repair} />
    </MainWrapper>
  )
}
