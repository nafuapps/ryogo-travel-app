import { PageWrapper } from "@/components/page/pageWrappers"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import { APP_TRIAL_MODE } from "@/lib/uiConfig"
import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"

export default async function AnalyticsPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Analytics")

  //Get agency Data
  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC

  //SUBSCRIPTION BLOCKER: Analytics page is only for Premium users
  if (
    !APP_TRIAL_MODE &&
    (isBasic || agency.subscriptionExpiresOn < new Date())
  ) {
    return (
      <PageWrapper id="AnalyticsBlockedPage">
        <SubscriptionBlockerSection
          warningText={
            isBasic ? t("AnalyticsTrialWarning") : t("AnalyticsExpiredWarning")
          }
          actionText={
            isBasic ? t("AnalyticsTrialAction") : t("AnalyticsExpiredAction")
          }
          isOwner
          ctaLabel={
            isBasic
              ? agency.hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
              : t("RenewCTA")
          }
        />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper id="AnalyticsPage">
      <></>
    </PageWrapper>
  )
}
