import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { Hourglass } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import { RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TRIAL_MODE } from "@/lib/uiConfig"

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

  if (
    !TRIAL_MODE &&
    (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
      agency.subscriptionExpiresOn < new Date())
  ) {
    //SUBSCRIPTION BLOCKER: Analytics page reached
    return (
      <PageWrapper id="AnalyticsBlockedPage">
        <SectionWrapper id="AnalyticsBlockedSection" center>
          <RyogoEnclosedIcon
            icon={Hourglass}
            size="md"
            color="yellow"
            bgColor="yellow"
          />
          <RyogoSmall color="yellow">
            {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
              ? t("AnalyticsTrialWarning")
              : t("AnalyticsExpiredWarning")}
          </RyogoSmall>
          <RyogoP className="text-center">
            {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
              ? t("AnalyticsTrialAction")
              : t("AnalyticsExpiredAction")}
          </RyogoP>
          <Link href="/dashboard/account/subscription">
            <Button variant={"brand"} size="lg">
              {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
                ? t("BuyCTA")
                : t("RenewCTA")}
            </Button>
          </Link>
        </SectionWrapper>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper id="AnalyticsPage">
      <></>
    </PageWrapper>
  )
}
