//All Users page (only accesssible by owner)

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import UsersPageComponent from "./users"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `Users - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllUsersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const allUsers = await userServices.findAllUsersInAgency(currentUser.agencyId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users"} />
      <UsersPageComponent
        allUsers={allUsers}
        isPremium={agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC}
      />
    </MainWrapper>
  )
}
