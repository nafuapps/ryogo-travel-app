import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { APP_TRIAL_MODE } from "@ryogo-travel-app/api/apiConfig"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"
import AddOwnerPageComponent from "./addOwner"

export const metadata: Metadata = {
  title: `Add Owner - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddOwnerPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Only agency admin can add more owners
  if (!currentUser.isAdmin) {
    redirect("/dashboard/users", RedirectType.replace)
  }
  const isSubscribed = currentUser.isSubscribed

  //SUBSCRIPTION BLOCKER: Only Premium agencies can add more owners
  if (
    !APP_TRIAL_MODE &&
    (!isSubscribed || currentUser.subscriptionExpiresOn < new Date())
  ) {
    const t = await getTranslations("Dashboard.AddOwner")

    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/users/add-owner"} />
        <PageWrapper id="AddOwnerPage">
          <SubscriptionBlockerSection
            warningText={
              !isSubscribed ? t("TrialWarning") : t("ExpiredWarning")
            }
            actionText={!isSubscribed ? t("TrialAction") : t("ExpiredAction")}
            isOwner
            ctaLabel={
              !isSubscribed
                ? currentUser.hasTriedSubscription
                  ? t("BuyCTA")
                  : t("TryCTA")
                : t("RenewCTA")
            }
          />
        </PageWrapper>
      </MainWrapper>
    )
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users/add-owner"} />
      <AddOwnerPageComponent agencyId={currentUser.agencyId} />
    </MainWrapper>
  )
}
