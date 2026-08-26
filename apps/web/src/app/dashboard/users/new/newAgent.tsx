import { PageWrapper } from "@/components/page/pageWrappers"
import NewAgentForm from "./newAgentForm"
import {
  SubscriptionPlanEnum,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { BASIC_PLAN_AGENT_LIMIT, APP_TRIAL_MODE } from "@/lib/uiConfig"
import { getTranslations } from "next-intl/server"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"

export default async function NewAgentPageComponent({
  agency,
  allAgents,
}: {
  agency: NonNullable<FindAgencyByIdType>
  allAgents: FindAllUsersByRoleType
}) {
  const t = await getTranslations("Dashboard.NewAgent")

  const currentAgentUsers = allAgents.filter(
    (agent) =>
      agent.agencyId === agency.id && agent.status !== UserStatusEnum.SUSPENDED,
  ).length

  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC

  //SUBSCRIPTION BLOCKER: Only Premium agencies can add more than X agents
  if (
    !APP_TRIAL_MODE &&
    currentAgentUsers >= BASIC_PLAN_AGENT_LIMIT &&
    (isBasic || agency.subscriptionExpiresOn < new Date())
  ) {
    return (
      <PageWrapper id="NewAgentPage">
        <SubscriptionBlockerSection
          warningText={isBasic ? t("TrialWarning") : t("ExpiredWarning")}
          actionText={isBasic ? t("TrialAction") : t("ExpiredAction")}
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
    <PageWrapper id="NewAgentPage">
      <NewAgentForm
        allAgents={allAgents}
        agencyId={agency.id}
        agencyName={agency.businessName}
      />
    </PageWrapper>
  )
}
