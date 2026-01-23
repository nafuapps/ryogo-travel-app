//Account/help page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../../components/extra/dashboardHeader"
import AccountHelpPageComponent from "./help"

export default async function AccountHelpPage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account/help"} />
      <AccountHelpPageComponent />
    </div>
  )
}
