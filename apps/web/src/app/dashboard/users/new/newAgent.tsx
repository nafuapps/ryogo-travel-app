import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import NewAgentForm from "./newAgentForm"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { TRIAL_AGENT_LIMIT, TRIAL_MODE } from "@/lib/uiConfig"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoSmall, RyogoH4 } from "@/components/typography"
import { Hourglass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function NewAgentPageComponent({
  agencyId,
  isOwner,
}: {
  agencyId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.NewAgent")

  const allAgents = await userServices.findAllUsersByRole([UserRolesEnum.AGENT])

  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const currentAgentUsers = allAgents.filter(
    (agent) =>
      agent.agencyId === agencyId && agent.status !== UserStatusEnum.SUSPENDED,
  ).length

  //Only allow subscribed agencies to add more than X agents
  if (
    !TRIAL_MODE &&
    currentAgentUsers >= TRIAL_AGENT_LIMIT &&
    (agency.subscriptionPlan === SubscriptionPlanEnum.TRIAL ||
      agency.subscriptionExpiresOn < new Date())
  ) {
    return (
      <PageWrapper id="NewAgentPage">
        <SectionWrapper id="AgentLimitSection" center>
          <RyogoEnclosedIcon
            icon={Hourglass}
            size="md"
            color="yellow"
            bgColor="yellow"
          />
          <RyogoSmall color="yellow">
            {agency.subscriptionPlan === SubscriptionPlanEnum.TRIAL
              ? t("TrialWarning")
              : t("ExpiredWarning")}
          </RyogoSmall>
          <RyogoH4>
            {agency.subscriptionPlan === SubscriptionPlanEnum.TRIAL
              ? t("TrialAction")
              : t("ExpiredAction")}
          </RyogoH4>
          {isOwner && (
            <Link href="/dashboard/account/subscription">
              <Button variant={"brand"} size="lg">
                {agency.subscriptionPlan === SubscriptionPlanEnum.TRIAL
                  ? t("BuyCTA")
                  : t("RenewCTA")}
              </Button>
            </Link>
          )}
        </SectionWrapper>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper id="NewAgentPage">
      <NewAgentForm
        allAgents={allAgents}
        agencyId={agencyId}
        agencyName={agency.businessName}
      />
    </PageWrapper>
  )
}
