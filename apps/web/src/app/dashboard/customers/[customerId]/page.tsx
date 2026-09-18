import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import CustomerDetailsPageComponent from "./customerDetails"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `Cusomer Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ customerId: string }>
}) {
  const { customerId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const customer = await customerServices.findCustomerDetailsById(customerId)
  if (!customer) {
    redirect("/dashboard/customers", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers/[id]"} />
      <CustomerDetailsPageComponent
        customer={customer}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
