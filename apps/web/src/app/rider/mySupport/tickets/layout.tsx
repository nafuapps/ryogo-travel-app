import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import RiderHeader from "@/components/header/riderHeader"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { APP_TRIAL_MODE } from "@ryogo-travel-app/api/apiConfig"
import { getTranslations } from "next-intl/server"

export default async function MySupportTicketsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const isSubscribed = currentUser.isSubscribed

  //SUBSCRIPTION BLOCKER: Only premium users can access support tickets
  if (
    !APP_TRIAL_MODE &&
    (!isSubscribed || currentUser.subscriptionExpiresOn < new Date())
  ) {
    const t = await getTranslations("Rider.MySupportTickets")
    return (
      <MainWrapper>
        <RiderHeader pathName={"/rider/mySupport/tickets"} />
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
          />
        </PageWrapper>
      </MainWrapper>
    )
  }

  return children
}
