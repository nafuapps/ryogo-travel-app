import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import ModifyCustomerPageComponent from "./modifyCustomer"

export const metadata: Metadata = {
  title: `Modify Customer - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyCustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { customerId } = await params

  const customer = await customerServices.findCustomerDetailsById(customerId)
  if (!customer) {
    redirect("/dashboard/customers", RedirectType.replace)
  }

  //Only owner or the addedByUser can modify customer
  if (
    currentUser.userRole !== UserRolesEnum.OWNER &&
    customer.addedByUserId !== currentUser.userId
  ) {
    redirect("/dashboard/home", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers/[id]/modify"} />
      <ModifyCustomerPageComponent customer={customer} />
    </MainWrapper>
  )
}
