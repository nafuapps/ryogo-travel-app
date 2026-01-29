//Drivers/id/modify page (only accessible by owner)

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyDriverPageComponent from "./modifyDriver"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"

export default async function ModifyDriverPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const driver = await driverServices.findDriverDetailsById(id)

  if (!driver) {
    redirect("/dashboard/drivers", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/modify"} />
      <ModifyDriverPageComponent driver={driver} />
    </div>
  )
}
