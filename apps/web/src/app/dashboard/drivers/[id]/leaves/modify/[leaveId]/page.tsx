//Modify Driver leave page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyDriverLeavePageComponent from "./modifyDriverLeave"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { DriverLeaveRegex } from "@/lib/regex"
import { redirect, RedirectType } from "next/navigation"

export default async function ModifyDriverLeavePage({
  params,
}: {
  params: Promise<{ id: string; leaveId: string }>
}) {
  const { id, leaveId } = await params

  //Invalid leave id regex check
  if (!DriverLeaveRegex.safeParse(leaveId).success) {
    redirect(`/dashboard/drivers/${id}/leaves`, RedirectType.replace)
  }

  const leave = await driverServices.findDriverLeaveById(leaveId)

  //If no such leave found, redirect
  if (!leave) {
    redirect(`/dashboard/drivers/${id}/leaves`, RedirectType.replace)
  }
  //Can anyone modify leave?

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/leaves/modify"} />
      <ModifyDriverLeavePageComponent leave={leave} />
    </div>
  )
}
