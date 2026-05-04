import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import ModifyVehiclePageComponent from "./modifyVehicle"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Modify Vehicle - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const vehicle = await vehicleServices.findVehicleDetailsById(id)
  if (!vehicle) {
    redirect("/dashboard/vehicles", RedirectType.replace)
  }
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/modify"} />
      <ModifyVehiclePageComponent vehicle={vehicle} />
    </MainWrapper>
  )
}
