import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import DashboardHeader from "../../components/dashboardHeader"
import NewCustomerPageComponent from "../../customers/new/newCustomer"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

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
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers/new"} />
      <NewCustomerPageComponent
        agencyId={currentUser.agencyId}
        userId={currentUser.userId}
      />
    </div>
  )
}
