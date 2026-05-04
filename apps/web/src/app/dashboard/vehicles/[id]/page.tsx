//Vehicles/id (details) page

import VehicleDetailsPageComponent from "./vehicleDetails"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import { redirect, RedirectType } from "next/navigation"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Vehicle Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  const vehicle = await vehicleServices.findVehicleDetailsById(id)

  if (
    !vehicle ||
    user.agencyId !== vehicle.agencyId ||
    vehicle.status === VehicleStatusEnum.SUSPENDED
  ) {
    redirect("/dashboard/vehicles", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]"} />
      <VehicleDetailsPageComponent vehicle={vehicle} />
    </MainWrapper>
  )
}
