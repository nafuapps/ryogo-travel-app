//Drivers/new page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../../components/extra/dashboardHeader"
import NewDriverPageComponent from "./newDriver"

export default function NewDriverPage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/new"} />
      <NewDriverPageComponent />
    </div>
  )
}
