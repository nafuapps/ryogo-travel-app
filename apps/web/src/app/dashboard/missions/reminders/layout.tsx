import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { APP_TRIAL_MODE } from "@/lib/uiConfig"
import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import { getTranslations } from "next-intl/server"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import DashboardHeader from "@/components/header/dashboardHeader"
import MissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/missionDetailHeaderTabs"

export default async function RemindersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC

  //SUBSCRIPTION BLOCKER: Only Premium agencies can access reminders
  if (
    !APP_TRIAL_MODE &&
    (isBasic || agency.subscriptionExpiresOn < new Date())
  ) {
    const t = await getTranslations("Dashboard.Reminders")
    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/missions/reminders"} />
        <MissionDetailHeaderTabs selectedTab={"Reminders"} />
        <PageWrapper id="RemindersBlockedPage">
          <SubscriptionBlockerSection
            warningText={
              isBasic
                ? t("RemindersTrialWarning")
                : t("RemindersExpiredWarning")
            }
            actionText={
              isBasic ? t("RemindersTrialAction") : t("RemindersExpiredAction")
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
      </MainWrapper>
    )
  }

  return children
}
