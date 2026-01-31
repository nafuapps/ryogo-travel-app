//Customers/id/modify page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyCustomerPageComponent from "./modifyCustomer"
import { getCurrentUser } from "@/lib/auth"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export default async function ModifyCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  const customer = await customerServices.findCustomerDetailsById(id)
  if (!customer) {
    redirect("/dashboard/customers", RedirectType.replace)
  }
  //Only owner or the adding agent can modify customer
  if (
    user.userRole != UserRolesEnum.OWNER &&
    customer.addedByUserId != user.userId
  ) {
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers/[id]/modify"} />
      <ModifyCustomerPageComponent customer={customer} />
    </div>
  )
}
