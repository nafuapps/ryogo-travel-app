import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import DashboardHeader from "@/components/header/dashboardHeader"
import MissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/missionDetailHeaderTabs"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { APP_TRIAL_MODE } from "@ryogo-travel-app/api/apiConfig"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"

export default async function RemindersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const isSubscribed = currentUser.isSubscribed
  //SUBSCRIPTION BLOCKER: Only Premium agencies can access reminders
  if (
    !APP_TRIAL_MODE &&
    (!isSubscribed || currentUser.subscriptionExpiresOn < new Date())
  ) {
    const t = await getTranslations("Dashboard.Reminders")
    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/missions/reminders"} />
        <MissionDetailHeaderTabs selectedTab={"Reminders"} />
        <PageWrapper id="RemindersBlockedPage">
          <SubscriptionBlockerSection
            warningText={
              !isSubscribed
                ? t("RemindersTrialWarning")
                : t("RemindersExpiredWarning")
            }
            actionText={
              !isSubscribed
                ? t("RemindersTrialAction")
                : t("RemindersExpiredAction")
            }
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

  return children
}
