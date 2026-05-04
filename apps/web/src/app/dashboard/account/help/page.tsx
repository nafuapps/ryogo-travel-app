import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import AccountHelpPageComponent from "./help"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function AccountHelpPage() {
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/help"} />
      <AccountHelpPageComponent />
    </MainWrapper>
  )
}
