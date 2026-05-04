import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import CustomersPageComponent from "../customers/customers"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Customers - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllCustomersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = user.agencyId
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers"} />
      <CustomersPageComponent agencyId={agencyId} />
    </MainWrapper>
  )
}
