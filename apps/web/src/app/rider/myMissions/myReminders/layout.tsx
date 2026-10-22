import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import MyMissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/myMissionDetailHeaderTabs"
import RiderHeader from "@/components/header/riderHeader"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { APP_TRIAL_MODE } from "@ryogo-travel-app/api/apiConfig"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"

export default async function MyRemindersLayout({
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
        <RiderHeader pathName={"/rider/myMissions/myReminders"} />
        <MyMissionDetailHeaderTabs selectedTab={"Reminders"} />
        <PageWrapper id="MyRemindersBlockedPage">
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
