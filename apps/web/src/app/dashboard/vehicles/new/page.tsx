//Vehicles/new page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../../components/extra/dashboardHeader"
import NewVehiclePageComponent from "./newVehicle"

export default function NewVehiclePage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/new"} />
      <NewVehiclePageComponent />
    </div>
  )
}
