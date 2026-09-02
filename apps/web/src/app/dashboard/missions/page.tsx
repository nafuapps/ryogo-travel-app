import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "@/components/header/dashboardHeader"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import MissionsPageComponent from "./missions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `Missions - ${pageTitle}`,
  description: pageDescription,
}

export default async function MissionsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const missions = await missionServices.findMissionsByUserId(
    currentUser.userId,
  )

  const expiryAlerts = await agencyServices.findAgencyExpiryAlerts(
    currentUser.agencyId,
    currentUser.userId,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/missions"} />
      <MissionsPageComponent
        missions={missions}
        isPremium={agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC}
        expiryAlerts={expiryAlerts}
      />
    </MainWrapper>
  )
}
