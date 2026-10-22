//Analytics page (only accessible by owner)

import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { APP_TRIAL_MODE } from "@ryogo-travel-app/api/apiConfig"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"
import AnalyticsPageComponent from "./analytics"

export const metadata: Metadata = {
  title: `Analytics - ${pageTitle}`,
  description: pageDescription,
}

export default async function AnalyticsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/home", RedirectType.replace)
  }
  const isSubscribed = currentUser.isSubscribed

  const t = await getTranslations("Dashboard.Analytics")

  //SUBSCRIPTION BLOCKER: Analytics page is only for Premium users
  if (
    !APP_TRIAL_MODE &&
    (!isSubscribed || currentUser.subscriptionExpiresOn < new Date())
  ) {
    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/analytics"} />
        <PageWrapper id="AnalyticsBlockedPage">
          <SubscriptionBlockerSection
            warningText={
              isSubscribed
                ? t("AnalyticsExpiredWarning")
                : t("AnalyticsTrialWarning")
            }
            actionText={
              isSubscribed
                ? t("AnalyticsExpiredAction")
                : t("AnalyticsTrialAction")
            }
            isOwner
            ctaLabel={
              isSubscribed
                ? t("RenewCTA")
                : currentUser.hasTriedSubscription
                  ? t("BuyCTA")
                  : t("TryCTA")
            }
          />
        </PageWrapper>
      </MainWrapper>
    )
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/analytics"} />
      <AnalyticsPageComponent />
    </MainWrapper>
  )
}
