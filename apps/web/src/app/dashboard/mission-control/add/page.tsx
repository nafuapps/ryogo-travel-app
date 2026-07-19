import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "@/components/header/dashboardHeader"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import AddCustomMissionPageComponent from "./addCustomMission"

export const metadata: Metadata = {
  title: `Add Custom Mission - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddCustomMissionPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Only Premium agencies can add custom missions
  if (agency.subscriptionPlan !== SubscriptionPlanEnum.PREMIUM) {
    redirect("/dashboard/mission-control", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/mission-control/add"} />
      <AddCustomMissionPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
      />
    </MainWrapper>
  )
}
