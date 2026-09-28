import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "@/components/header/dashboardHeader"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import ExpiryAlertsPageComponent from "./expiryAlerts"
import MissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/missionDetailHeaderTabs"

export const metadata: Metadata = {
  title: `Expiry Alerts - ${pageTitle}`,
  description: pageDescription,
}

export default async function ExpiryAlertsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const expiryAlerts = await agencyServices.findAgencyExpiryAlerts(
    currentUser.agencyId,
    currentUser.userId,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/missions/expiry-alerts"} />
      <MissionDetailHeaderTabs selectedTab={"ExpiryAlerts"} />
      <ExpiryAlertsPageComponent expiryAlerts={expiryAlerts} />
    </MainWrapper>
  )
}
