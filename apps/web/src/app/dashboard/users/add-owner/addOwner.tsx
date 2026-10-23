import { PageWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { notFound } from "next/navigation"
import AddOwnerForm from "./addOwnerForm"

export default async function AddOwnerPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    notFound()
  }

  const allOwners = await userServices.findAllUsersByRole([UserRolesEnum.OWNER])

  return (
    <PageWrapper id="AddOwnerPage">
      <AddOwnerForm
        allOwners={allOwners}
        agencyId={agencyId}
        agencyName={agency.businessName}
      />
    </PageWrapper>
  )
}
