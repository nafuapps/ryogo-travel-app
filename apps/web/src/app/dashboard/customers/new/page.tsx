//Customers/new page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../../components/extra/dashboardHeader"
import NewCustomerPageComponent from "../../customers/new/newCustomer"

export default async function NewCustomerPage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers/new"} />
      <NewCustomerPageComponent />
    </div>
  )
}
