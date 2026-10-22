import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import DashboardHeader from "@/components/header/dashboardHeader"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { APP_TRIAL_MODE } from "@ryogo-travel-app/api/apiConfig"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"

export default async function SupportTicketsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const isSubscribed = currentUser.isSubscribed
  //SUBSCRIPTION BLOCKER: Only premium users can access support tickets
  if (
    !APP_TRIAL_MODE &&
    (!isSubscribed || currentUser.subscriptionExpiresOn < new Date())
  ) {
    const t = await getTranslations("Dashboard.SupportTickets")
    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/support/tickets"} />
        <PageWrapper id="SupportTicketsBlockerPage">
          <SubscriptionBlockerSection
            warningText={
              !isSubscribed
                ? t("TicketsTrialWarning")
                : t("TicketsExpiredWarning")
            }
            actionText={
              !isSubscribed
                ? t("TicketsTrialAction")
                : t("TicketsExpiredAction")
            }
            isOwner={currentUser.userRole === UserRolesEnum.OWNER}
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
