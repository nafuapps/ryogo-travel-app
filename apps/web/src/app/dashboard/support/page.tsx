import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { Metadata } from "next"
import {
  DoubleContentWrapper,
  MainWrapper,
} from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import SupportPageComponent from "./support"
import SupportSideComponent from "./supportSide"

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

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support"} />
      <DoubleContentWrapper>
        <SupportPageComponent
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        />
        <SupportSideComponent
          isPremium={agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC}
        />
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
