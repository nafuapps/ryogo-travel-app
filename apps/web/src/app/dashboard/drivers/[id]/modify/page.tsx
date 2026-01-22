//Drivers/id/modify page (only accessible by owner)

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyDriverPageComponent from "./modifyDriver"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export default async function ModifyDriverPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const driver = await driverServices.findDriverDetailsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/modify"} />
      <ModifyDriverPageComponent driver={driver} />
    </div>
  )
}
