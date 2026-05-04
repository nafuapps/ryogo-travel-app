//Customers/id/assigned bookings page

import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "../../../components/dashboardHeader"
import CustomerUpcomingBookingsPageComponent from "./customerUpcomingBookings"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Customer Upcoming Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function CustomerUpcomingBookingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const bookings = await customerServices.findCustomerUpcomingBookingsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/customers/[id]/upcoming"} />
      <CustomerUpcomingBookingsPageComponent bookings={bookings} id={id} />
    </div>
  )
}
