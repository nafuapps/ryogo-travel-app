//Bookings/id/expenses/modify page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { redirect, RedirectType } from "next/navigation"
import ModifyExpensePageComponent from "./modifyExpense"
import { ExpenseRegex } from "@/lib/regex"

export default async function ModifyExpensePage({
  params,
}: {
  params: Promise<{ id: string; expId: string }>
}) {
  const { id, expId } = await params

  //Invalid expense id regex check
  if (!ExpenseRegex.safeParse(expId).success) {
    redirect(`/dashboard/bookings/${id}/expenses`, RedirectType.replace)
  }

  const user = await getCurrentUser()

  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  const expenseDetails = await expenseServices.getExpenseDetailsById(expId)

  //Only owner or assigned user can modify expenses
  if (
    !user ||
    !expenseDetails ||
    (user?.userRole !== "owner" &&
      user?.userId !== bookingDetails?.assignedUser.id)
  ) {
    console.log({ user })
    redirect(`/dashboard/bookings/${id}/expenses`, RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses/modify"} />
      <ModifyExpensePageComponent
        bookingId={id}
        expenseId={expId}
        expenseDetails={expenseDetails}
      />
    </div>
  )
}
