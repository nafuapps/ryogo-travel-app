import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import ModifyVehicleRepairPageComponent from "./modifyVehicleRepair"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { VehicleRepairIdRegex } from "@/lib/regex"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `Modify Vehicle Repair - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyVehicleRepairPage({
  params,
}: {
  params: Promise<{ vehicleId: string; repairId: string }>
}) {
  const { vehicleId, repairId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  //Invalid repair id regex check
  if (!VehicleRepairIdRegex.safeParse(repairId).success) {
    redirect(`/dashboard/vehicles/${vehicleId}/repairs`, RedirectType.replace)
  }

  const repair = await vehicleServices.findVehicleRepairById(repairId)

  //If no such repair found or vehicle mismatch or agency mismatch, redirect
  if (
    !repair ||
    repair.vehicleId !== vehicleId ||
    repair.agencyId !== currentUser.agencyId
  ) {
    redirect(`/dashboard/vehicles/${vehicleId}/repairs`, RedirectType.replace)
  }

  //Only owner or addedByUser can modify repair
  if (
    currentUser.userRole !== UserRolesEnum.OWNER &&
    repair.addedByUserId !== currentUser.userId
  ) {
    redirect(`/dashboard/vehicles/${vehicleId}/repairs`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/repairs/modify"} />
      <ModifyVehicleRepairPageComponent repair={repair} />
    </MainWrapper>
  )
}
