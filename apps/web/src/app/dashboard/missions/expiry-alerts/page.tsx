import DashboardHeader from "@/components/header/dashboardHeader"
import MissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/missionDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { Metadata } from "next"
import ExpiryAlertsPageComponent from "./expiryAlerts"

export const metadata: Metadata = {
  title: `Expiry Alerts - ${pageTitle}`,
  description: pageDescription,
}

export default async function ExpiryAlertsPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const expiryAlerts = await agencyServices.findAgencyExpiryAlerts({
    agencyId: currentUser.agencyId,
  })

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/missions/expiry-alerts"} />
      <MissionDetailHeaderTabs selectedTab={"ExpiryAlerts"} />
      <ExpiryAlertsPageComponent expiryAlerts={expiryAlerts} />
    </MainWrapper>
  )
}
