import { PageWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { notFound } from "next/navigation"
import NewAgentForm from "./newAgentForm"

export default async function NewAgentPageComponent({
  agencyId,
  allAgents,
}: {
  agencyId: string
  allAgents: FindAllUsersByRoleType
}) {
  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    notFound()
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
