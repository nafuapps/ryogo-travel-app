//Vehicle Repairs page

import DashboardHeader from "@/app/dashboard/components/common/dashboardHeader"
import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import AllVehicleRepairsPageComponent from "./allVehicleRepairs"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Vehicle Repairs - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllVehicleRepairsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const vehicleRepairs =
    await vehicleServices.findAllVehicleRepairsByVehicleId(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/repairs"} />
      <AllVehicleRepairsPageComponent
        repairs={vehicleRepairs}
        vehicleId={id}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </div>
  )
}
