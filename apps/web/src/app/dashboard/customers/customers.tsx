import { PageWrapper } from "@/components/page/pageWrappers"
import AllCustomersListComponent from "./allCustomersListComponent"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"

/**
 *  Show all customers list (except suspended)
 *  TODO: Customer schedule (7/14 days)
 *  TODO: Customer history
 *  TODO: Customer actions
 */

export default async function CustomersPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const allCustomers = await customerServices.findCustomersInAgency(agencyId)

  return (
    <PageWrapper id="CustomersPage">
      <AllCustomersListComponent allCustomers={allCustomers} />
    </PageWrapper>
  )
}
