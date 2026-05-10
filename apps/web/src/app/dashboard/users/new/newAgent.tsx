import { PageWrapper } from "@/components/page/pageWrappers"
import NewAgentForm from "./newAgentForm"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export default async function NewAgentPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  //TODO: Only allow subscribed agencies to add more than 2 agents

  const allAgents = await userServices.findAllUsersByRole([UserRolesEnum.AGENT])

  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
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
