//Vehicle Repairs page

import DashboardHeader from "@/components/header/dashboardHeader"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import AllVehicleRepairsPageComponent from "./allVehicleRepairs"

export const metadata: Metadata = {
  title: `Vehicle Repairs - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllVehicleRepairsPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { vehicleId } = await params

  const vehicle = await vehicleServices.findVehicleDetailsById(vehicleId)
  if (!vehicle) {
    redirect("/dashboard/vehicles", RedirectType.replace)
  }

  const vehicleRepairs =
    await vehicleServices.findAllVehicleRepairsByVehicleId(vehicleId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/repairs"} />
      <VehicleDetailHeaderTabs selectedTab={"Repairs"} id={vehicleId} />
      <AllVehicleRepairsPageComponent
        repairs={vehicleRepairs}
        vehicle={vehicle}
        curentUserId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
