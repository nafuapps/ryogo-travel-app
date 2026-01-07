//All vehicles page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../components/extra/dashboardHeader"
import VehiclesPageComponent from "./vehicles"

export default function AllVehiclesPage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles"} />
      <VehiclesPageComponent />
    </div>
  )
}
