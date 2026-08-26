import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { getTranslations } from "next-intl/server"
import DashboardHeader from "@/components/header/dashboardHeader"
import { APP_TRIAL_MODE } from "@/lib/uiConfig"
import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"

export default async function SupportTicketsLayout({
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

  //SUBSCRIPTION BLOCKER: Only premium users can access support tickets
  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
  if (
    !APP_TRIAL_MODE &&
    (isBasic || agency.subscriptionExpiresOn < new Date())
  ) {
    const t = await getTranslations("Dashboard.SupportTickets")
    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/support/tickets"} />
        <PageWrapper id="SupportTicketsBlockerPage">
          <SubscriptionBlockerSection
            warningText={
              isBasic ? t("TicketsTrialWarning") : t("TicketsExpiredWarning")
            }
            actionText={
              isBasic ? t("TicketsTrialAction") : t("TicketsExpiredAction")
            }
            isOwner={currentUser.userRole === UserRolesEnum.OWNER}
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
