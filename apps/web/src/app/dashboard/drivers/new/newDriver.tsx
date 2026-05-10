import { PageWrapper } from "@/components/page/pageWrappers"
import NewDriverForm from "./newDriverForm"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export default async function NewDriverPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  //TODO: Only allow subscribed agencies to add more than 2 drivers

  const allDrivers = await userServices.findAllUsersByRole([
    UserRolesEnum.DRIVER,
  ])

  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <PageWrapper id="NewDriverPage">
      <NewDriverForm
        agencyId={agencyId}
        allDrivers={allDrivers}
        agencyName={agency.businessName}
      />
    </PageWrapper>
  )
}
