import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import { APP_TRIAL_MODE } from "@ryogo-travel-app/api/apiConfig"
import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import { Construction } from "lucide-react"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoP } from "@/components/typography"
import Link from "next/link"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default async function AnalyticsPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  //Get agency Data
  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
  const t = await getTranslations("Dashboard.Analytics")

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

  //TODO: Add Analytics feature
  return (
    <PageWrapper id="AnalyticsPage">
      <SectionWrapper id="ComingSoonSection" className="items-center">
        <RyogoEnclosedIcon
          icon={Construction}
          size="md"
          color="brand"
          bgColor="brand"
        />
        <RyogoP className="text-center">{t("ComingSoon")}</RyogoP>
        <Link href="/dashboard/home">
          <RyogoOutlineButton label={t("Back")} />
        </Link>
      </SectionWrapper>
    </PageWrapper>
  )
}
