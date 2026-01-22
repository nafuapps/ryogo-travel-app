import { pageClassName } from "@/components/page/pageCommons"
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
    <div id="CustomersPage" className={pageClassName}>
      <AllCustomersListComponent allCustomers={allCustomers} />
    </div>
  )
}
