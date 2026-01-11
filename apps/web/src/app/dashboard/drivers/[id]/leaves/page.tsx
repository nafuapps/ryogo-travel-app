//Driver Leaves page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import AllDriverLeavesPageComponent from "./allDriverLeaves"
import { mainClassName } from "@/components/page/pageCommons"

export default async function AllDriverLeavesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const driverLeaves = await driverServices.findAllDriverLeavesByDriverId(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/leaves"} />
      <AllDriverLeavesPageComponent leaves={driverLeaves} />
    </div>
  )
}
