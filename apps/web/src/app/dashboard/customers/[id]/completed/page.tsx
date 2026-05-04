import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import CustomerCompletedBookingsPageComponent from "./customerCompletedBookings"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

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
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers/[id]/completed"} />
      <CustomerCompletedBookingsPageComponent bookings={bookings} id={id} />
    </MainWrapper>
  )
}
