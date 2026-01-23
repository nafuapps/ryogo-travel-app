//Account page

import DashboardHeader from "../components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import AccountPageComponent from "./account"

export default async function AccountPage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account"} />
      <AccountPageComponent />
    </div>
  )
}
