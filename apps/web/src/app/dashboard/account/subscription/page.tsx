//Account page

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import SubscriptionPageComponent from "./subscription"

export const metadata: Metadata = {
  title: `Subscription - ${pageTitle}`,
  description: pageDescription,
}

export default async function SubscriptionPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Only owner can access
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/account", RedirectType.replace)
  }

  const userDetails = await userServices.findUserDetailsById(currentUser.userId)
  const agency = await agencyServices.findAgencyById(currentUser.agencyId)

  if (!userDetails || !agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/subscription"} />
      <SubscriptionPageComponent
        userDetails={userDetails}
        agencyDetails={agency}
      />
    </MainWrapper>
  )
}
