//Account/help page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../../components/common/dashboardHeader"
import AccountHelpPageComponent from "./help"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function AccountHelpPage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account/help"} />
      <AccountHelpPageComponent />
    </div>
  )
}
