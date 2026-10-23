import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { Metadata } from "next"
import NewCustomerPageComponent from "./newCustomer"

export const metadata: Metadata = {
  title: `New Customer - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewCustomerPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers/new"} />
      <NewCustomerPageComponent
        agencyId={currentUser.agencyId}
        userId={currentUser.userId}
      />
    </MainWrapper>
  )
}
