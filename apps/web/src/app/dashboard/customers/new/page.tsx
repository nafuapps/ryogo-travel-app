import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import NewCustomerPageComponent from "./newCustomer"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `New Customer - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewCustomerPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
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
