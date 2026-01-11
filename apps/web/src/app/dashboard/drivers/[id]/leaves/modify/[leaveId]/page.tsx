//Modify Driver leave page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyDriverLeavePageComponent from "./modifyDriverLeave"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export default async function ModifyDriverLeavePage({
  params,
}: {
  params: Promise<{ id: string; leaveId: string }>
}) {
  const { leaveId } = await params

  const leave = await driverServices.findDriverLeaveById(leaveId)

  //Can anyone modify leave?

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/leaves/modify"} />
      <ModifyDriverLeavePageComponent leave={leave} />
    </div>
  )
}
