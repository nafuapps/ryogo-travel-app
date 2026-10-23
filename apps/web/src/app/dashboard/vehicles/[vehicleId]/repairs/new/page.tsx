//Add a new vehicle repair page

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { Metadata } from "next"
import NewVehicleRepairPageComponent from "./newVehicleRepair"

export const metadata: Metadata = {
  title: `New Vehicle Repair - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewVehicleRepairPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { vehicleId } = await params

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/repairs/new"} />
      <NewVehicleRepairPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        vehicleId={vehicleId}
      />
    </MainWrapper>
  )
}
