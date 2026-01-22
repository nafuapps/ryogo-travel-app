//All Customers page

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "../components/extra/dashboardHeader"
import CustomersPageComponent from "../customers/customers"

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
