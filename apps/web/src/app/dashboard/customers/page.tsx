//All Customers page

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "../components/common/dashboardHeader"
import CustomersPageComponent from "../customers/customers"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customers - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function AllCustomersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = user.agencyId
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers"} />
      <CustomersPageComponent agencyId={agencyId} />
    </div>
  )
}
