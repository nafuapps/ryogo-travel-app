//Bookings/id/transactions page

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import BookingTransactionsPageComponent from "./bookingTransactions"

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const bookingTransactions = await bookingServices.findBookingTransactionsById(
    id
  )
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/transactions"} />
      <BookingTransactionsPageComponent
        bookingId={id}
        bookingTransactions={bookingTransactions}
      />
    </div>
  )
}
