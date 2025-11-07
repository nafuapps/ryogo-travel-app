//Bookings/id/expenses page

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import BookingExpensesPageComponent from "./bookingExpenses"

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const bookingExpenses = await bookingServices.findBookingExpensesById(id)
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses"} />
      <BookingExpensesPageComponent
        bookingId={id}
        bookingExpenses={bookingExpenses}
      />
    </div>
  )
}
