import { Metadata } from "next"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { redirect, RedirectType } from "next/navigation"
import { MainWrapper } from "@/components/page/pageWrappers"
import ChangeVehicleNumberPageComponent from "./changeVehicleNumber"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum, VehicleStatusEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `Change Vehicle Number - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeVehicleNumberPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const { vehicleId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

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
