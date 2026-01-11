//Drivers/id (details) page

import { mainClassName } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "../../components/extra/dashboardHeader"
import DriverDetailsPageComponent from "./driverDetails"

export default async function DriverDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const driver = await driverServices.findDriverDetailsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]"} />
      <DriverDetailsPageComponent driver={driver} />
    </div>
  )
}
