//Customers/id/ (details) page

import { mainClassName } from "@/components/page/pageCommons"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "../../components/extra/dashboardHeader"
import CustomerDetailsPageComponent from "./customerDetails"
import { redirect, RedirectType } from "next/navigation"

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const customer = await customerServices.findCustomerDetailsById(id)
  if (!customer) {
    redirect("/dashboard/customers", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers/[id]"} />
      <CustomerDetailsPageComponent customer={customer} />
    </div>
  )
}
