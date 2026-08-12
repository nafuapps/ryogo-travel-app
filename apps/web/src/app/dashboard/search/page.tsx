import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import SearchPageComponent from "./search"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import {
  BASIC_BOOKINGS_SEARCH_DAYS,
  PREMIUM_BOOKINGS_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"

export const metadata: Metadata = {
  title: `Search - ${pageTitle}`,
  description: pageDescription,
}

export default async function SearchPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const isSubscribed =
    agency.subscriptionExpiresOn > new Date() &&
    agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC

  const searchData = await agencyServices.findAgencySearchData(
    currentUser.agencyId,
    isSubscribed ? PREMIUM_BOOKINGS_SEARCH_DAYS : BASIC_BOOKINGS_SEARCH_DAYS,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/search"} />
      <SearchPageComponent searchData={searchData} agency={agency} />
    </MainWrapper>
  )
}
