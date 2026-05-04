//Add a new vehicle repair page

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import NewVehicleRepairPageComponent from "./newVehicleRepair"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `New Vehicle Repair - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewVehicleRepairPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/repairs/new"} />
      <NewVehicleRepairPageComponent
        userId={user.userId}
        agencyId={user.agencyId}
        vehicleId={id}
      />
    </MainWrapper>
  )
}
