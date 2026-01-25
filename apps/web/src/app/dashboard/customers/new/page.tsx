//Customers/new page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../../components/extra/dashboardHeader"
import NewCustomerPageComponent from "../../customers/new/newCustomer"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export default async function NewCustomerPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers/new"} />
      <NewCustomerPageComponent
        agencyId={currentUser.agencyId}
        userId={currentUser.userId}
      />
    </div>
  )
}
