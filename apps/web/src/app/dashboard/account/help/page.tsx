import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import DashboardHeader from "../../components/dashboardHeader"
import AccountHelpPageComponent from "./help"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function AccountHelpPage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account/help"} />
      <AccountHelpPageComponent />
    </div>
  )
}
