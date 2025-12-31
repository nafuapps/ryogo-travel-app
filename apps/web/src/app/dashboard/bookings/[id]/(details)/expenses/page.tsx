//Bookings/id/expenses page

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import BookingExpensesPageComponent from "./bookingExpenses"
import { getCurrentUser } from "@/lib/auth"

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  const bookingExpenses = await bookingServices.findBookingExpensesById(id)
  const assignedUserId = await bookingServices.findAssignedUserIdByBookingId(id)

  //Only booking assigned user or owner can create/modify expenses
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses"} />
      <BookingExpensesPageComponent
        bookingId={id}
        bookingExpenses={bookingExpenses}
        canCreateExpense={
          user?.userRole == "owner" || user?.userId == assignedUserId
        }
      />
    </div>
  )
}
