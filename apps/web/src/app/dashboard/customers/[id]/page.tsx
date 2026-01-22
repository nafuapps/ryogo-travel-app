//Customers/id/ (details) page

import { mainClassName } from "@/components/page/pageCommons"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "../../components/extra/dashboardHeader"
import CustomerDetailsPageComponent from "./customerDetails"

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const customer = await customerServices.findCustomerDetailsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers/[id]"} />
      <CustomerDetailsPageComponent customer={customer} />
    </div>
  )
}
