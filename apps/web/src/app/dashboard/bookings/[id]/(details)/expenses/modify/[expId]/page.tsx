import DashboardHeader from "@/components/header/dashboardHeader"
import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { redirect, RedirectType } from "next/navigation"
import ModifyExpensePageComponent from "./modifyExpense"
import { ExpenseRegex } from "@/lib/regex"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Modify Booking Expense - ${pageTitle}`,
  description: pageDescription,
}

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
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  const expenseDetails = await expenseServices.findExpenseDetailsById(expId)

  //Only owner or assigned user can modify expenses
  if (
    !expenseDetails ||
    !bookingDetails ||
    (user.userRole !== UserRolesEnum.OWNER &&
      user.userId !== bookingDetails.assignedUserId)
  ) {
    redirect(`/dashboard/bookings/${id}/expenses`, RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses/modify"} />
      <ModifyExpensePageComponent
        expenseDetails={expenseDetails}
        assignedUserId={bookingDetails.assignedUserId}
      />
    </div>
  )
}
