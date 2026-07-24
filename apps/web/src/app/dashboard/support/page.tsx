import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import SupportPageComponent from "./support"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export const metadata: Metadata = {
  title: `Support - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const isPremium = agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support"} />
      <SupportPageComponent
        id={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        isPremium={isPremium}
      />
    </MainWrapper>
  )
}
