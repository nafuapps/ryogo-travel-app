//Customers/id/modify page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyCustomerPageComponent from "./modifyCustomer"
import { getCurrentUser } from "@/lib/auth"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { redirect, RedirectType } from "next/navigation"

export default async function ModifyCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getCurrentUser()

  const customer = await customerServices.findCustomerDetailsById(id)

  //Only owner or the adding agent can modify customer
  if (user?.userRole != "owner" && customer.addedByUserId != user?.userId) {
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers/[id]/modify"} />
      <ModifyCustomerPageComponent customer={customer} />
    </div>
  )
}
