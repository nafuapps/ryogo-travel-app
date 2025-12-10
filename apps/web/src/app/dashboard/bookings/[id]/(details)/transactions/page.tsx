//Bookings/id/transactions page

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import BookingTransactionsPageComponent from "./bookingTransactions"
import { getCurrentUser } from "@/lib/auth"

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  const bookingTransactions = await bookingServices.findBookingTransactionsById(
    id
  )
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/transactions"} />
      <BookingTransactionsPageComponent
        bookingId={id}
        bookingTransactions={bookingTransactions}
        isOwner={user?.userRole == "owner"}
        isAssignedUser={
          user?.userId == bookingTransactions[0]?.booking.assignedUserId
        }
      />
    </div>
  )
}
