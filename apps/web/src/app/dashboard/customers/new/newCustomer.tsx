import { pageClassName } from "@/components/page/pageCommons"
import NewCustomerForm from "./newCustomerForm"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

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

  return (
    <div id="NewCustomerPage" className={pageClassName}>
      <NewCustomerForm
        agencyId={agencyId}
        allCustomers={allCustomers}
        userId={userId}
        agencyLocation={agency.location}
      />
    </div>
  )
}
