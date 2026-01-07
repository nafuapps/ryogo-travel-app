//All Drivers page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../components/extra/dashboardHeader"
import DriversPageComponent from "./drivers"

export default function AllDriversPage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers"} />
      <DriversPageComponent />
    </div>
  )
}
