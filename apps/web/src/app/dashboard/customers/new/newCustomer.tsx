import { PageWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { notFound } from "next/navigation"
import NewCustomerForm from "./newCustomerForm"

export default async function NewCustomerPageComponent({
  agencyId,
  userId,
}: {
  agencyId: string
  userId: string
}) {
  const allCustomers = await customerServices.findCustomersInAgency(agencyId)

  //Get agency Data (for location)
  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    notFound()
  }

  return (
    <PageWrapper id="NewCustomerPage">
      <NewCustomerForm
        agencyId={agencyId}
        allCustomers={allCustomers}
        userId={userId}
        agencyLocation={agency.location}
      />
    </PageWrapper>
  )
}
