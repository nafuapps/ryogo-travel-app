import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import AllCustomersListComponent from "./allCustomersListComponent"

export const metadata: Metadata = {
  title: `Customers - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllCustomersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const allCustomers = await customerServices.findCustomersInAgency(
    currentUser.agencyId,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers"} />
      <PageWrapper id="CustomersPage">
        <AllCustomersListComponent allCustomers={allCustomers} />
      </PageWrapper>
    </MainWrapper>
  )
}
