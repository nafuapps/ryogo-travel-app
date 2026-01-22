import { pageClassName } from "@/components/page/pageCommons"
import NewCustomerForm from "./newCustomerForm"
import { getCurrentUser } from "@/lib/auth"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export default async function NewCustomerPageComponent() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  const allCustomers = await customerServices.findCustomersInAgency(
    user.agencyId,
  )

  //Get agency Data (for location)
  const agency = await agencyServices.findAgencyById(user.agencyId)

  return (
    <div id="NewCustomerPage" className={pageClassName}>
      <NewCustomerForm
        agencyId={user.agencyId}
        allCustomers={allCustomers}
        userId={user.userId}
        agencyLocation={agency.location}
      />
    </div>
  )
}
