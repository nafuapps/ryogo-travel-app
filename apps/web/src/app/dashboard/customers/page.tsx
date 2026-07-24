import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import CustomersPageComponent from "./customers"

export const metadata: Metadata = {
  title: `Customers - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllCustomersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers"} />
      <CustomersPageComponent agencyId={currentUser.agencyId} />
    </MainWrapper>
  )
}
