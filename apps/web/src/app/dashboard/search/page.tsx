import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { Metadata } from "next"
import SearchPageComponent from "./search"

export const metadata: Metadata = {
  title: `Search - ${pageTitle}`,
  description: pageDescription,
}

export default async function SearchPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const searchData = await agencyServices.findAgencySearchData(
    currentUser.agencyId,
    currentUser.isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/search"} />
      <SearchPageComponent
        searchData={searchData}
        isPremium={currentUser.isSubscribed}
        subscriptionExpiresOn={currentUser.subscriptionExpiresOn}
        hasTriedSubscription={currentUser.hasTriedSubscription}
      />
    </MainWrapper>
  )
}
