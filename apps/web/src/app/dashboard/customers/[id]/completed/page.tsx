import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "../../../components/dashboardHeader"
import CustomerCompletedBookingsPageComponent from "./customerCompletedBookings"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Customer Completed Bookings - ${pageTitle}`,
  description: pageDescription,
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
