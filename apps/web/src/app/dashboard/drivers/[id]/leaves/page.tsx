//Driver Leaves page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import AllDriverLeavesPageComponent from "./allDriverLeaves"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export default async function AllDriverLeavesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const driverLeaves = await driverServices.findAllDriverLeavesByDriverId(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/leaves"} />
      <AllDriverLeavesPageComponent
        leaves={driverLeaves}
        driverId={id}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </div>
  )
}
