import { pageClassName } from "@/components/page/pageCommons"
import NewAgentForm from "./newAgentForm"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export default async function NewAgentPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  //TODO: Only allow subscribed agencies to add more than 2 agents

  const allAgents = await userServices.findAllUsersByRole([UserRolesEnum.AGENT])

  return (
    <div id="UsersPage" className={pageClassName}>
      <NewAgentForm allAgents={allAgents} agencyId={agencyId} />
    </div>
  )
}
