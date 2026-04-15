//Customers/id/ (details) page

import { mainClassName } from "@/components/page/pageCommons"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "../../components/common/dashboardHeader"
import CustomerDetailsPageComponent from "./customerDetails"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cusomer Details - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const customer = await customerServices.findCustomerDetailsById(id)
  if (!customer) {
    redirect("/dashboard/customers", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers/[id]"} />
      <CustomerDetailsPageComponent customer={customer} />
    </div>
  )
}
