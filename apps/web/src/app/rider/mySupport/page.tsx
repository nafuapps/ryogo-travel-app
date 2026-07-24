//Account/help page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import MySupportPageComponent from "./riderSupport"
import RiderHeader from "@/components/header/riderHeader"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `Support - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportPage() {
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
      <RiderHeader pathName={"/rider/mySupport"} />
      <MySupportPageComponent isPremium={isPremium} />
    </MainWrapper>
  )
}
