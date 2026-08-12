import VehicleDetailsPageComponent from "./vehicleDetails"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Vehicle Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const { vehicleId } = await params

  const vehicle = await vehicleServices.findVehicleDetailsById(vehicleId)

  if (!vehicle) {
    redirect("/dashboard/vehicles", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]"} />
      <VehicleDetailsPageComponent vehicle={vehicle} />
    </MainWrapper>
  )
}
