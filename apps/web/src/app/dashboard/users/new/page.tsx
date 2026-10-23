//Users/new page (only accessible to owner)

import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_AGENT_LIMIT,
} from "@ryogo-travel-app/api/apiConfig"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import NewAgentPageComponent from "./newAgent"

export const metadata: Metadata = {
  title: `New User - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewUserPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const isSubscribed = currentUser.isSubscribed

  const allAgents = await userServices.findAllUsersByRole([UserRolesEnum.AGENT])

  const currentAgentUsers = allAgents.filter(
    (agent) =>
      agent.agencyId === currentUser.agencyId &&
      agent.status !== UserStatusEnum.SUSPENDED,
  ).length

  //SUBSCRIPTION BLOCKER: Only Premium agencies can add more than X agents
  if (
    !APP_TRIAL_MODE &&
    currentAgentUsers >= BASIC_PLAN_AGENT_LIMIT &&
    (!isSubscribed || currentUser.subscriptionExpiresOn < new Date())
  ) {
    const t = await getTranslations("Dashboard.NewAgent")

    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/users/new"} />
        <PageWrapper id="NewAgentPage">
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
      <DashboardHeader pathName={"/dashboard/users/new"} />
      <NewAgentPageComponent
        agencyId={currentUser.agencyId}
        allAgents={allAgents}
      />
    </MainWrapper>
  )
}
