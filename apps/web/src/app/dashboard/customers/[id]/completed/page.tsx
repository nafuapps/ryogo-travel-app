//Customers/id/completed bookings page

import { mainClassName } from "@/components/page/pageCommons"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "../../../components/common/dashboardHeader"
import CustomerCompletedBookingsPageComponent from "./customerCompletedBookings"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customer Completed Bookings - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function CustomerCompletedBookingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const bookings = await customerServices.findCustomerCompletedBookingsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers/[id]/completed"} />
      <CustomerCompletedBookingsPageComponent bookings={bookings} id={id} />
    </div>
  )
}
