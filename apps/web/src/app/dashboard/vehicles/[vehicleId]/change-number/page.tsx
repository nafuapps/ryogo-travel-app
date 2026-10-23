import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { UserRolesEnum, VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import ChangeVehicleNumberPageComponent from "./changeVehicleNumber"

export const metadata: Metadata = {
  title: `Change Vehicle Number - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeVehicleNumberPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { vehicleId } = await params

  const vehicle = await vehicleServices.findVehicleDetailsById(vehicleId)

  if (
    !vehicle ||
    currentUser.agencyId !== vehicle.agencyId ||
    vehicle.status === VehicleStatusEnum.SUSPENDED
  ) {
    redirect("/dashboard/vehicles", RedirectType.replace)
  }

  if (
    vehicle.addedByUserId !== currentUser.userId &&
    currentUser.userRole !== UserRolesEnum.OWNER
  ) {
    redirect(`/dashboard/vehicles/${vehicleId}`, RedirectType.replace)
  }

  const currentAgencyVehicles =
    await vehicleServices.findExistingVehiclesInAgency(vehicle.agencyId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/change-number"} />
      <ChangeVehicleNumberPageComponent
        vehicleId={vehicle.id}
        allVehicles={currentAgencyVehicles}
        agencyId={vehicle.agencyId}
        addedByUserId={vehicle.addedByUserId}
        oldVehicleNumber={vehicle.vehicleNumber}
      />
    </MainWrapper>
  )
}
