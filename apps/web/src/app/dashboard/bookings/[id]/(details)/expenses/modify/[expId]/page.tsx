import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { redirect, RedirectType } from "next/navigation"
import ModifyExpensePageComponent from "./modifyExpense"
import { ExpenseIdRegex } from "@/lib/regex"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

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
  if (!ExpenseIdRegex.safeParse(expId).success) {
    redirect(`/dashboard/bookings/${id}/expenses`, RedirectType.replace)
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Get expense details from DB
  const expenseDetails = await expenseServices.findExpenseDetailsById(expId)

  //If no expense found, or bookingId/agency mismatch
  if (
    !expenseDetails ||
    expenseDetails.bookingId !== id ||
    expenseDetails.agencyId !== currentUser.agencyId
  ) {
    redirect(`/dashboard/bookings/${id}/expenses`, RedirectType.replace)
  }

  const booking = await bookingServices.findBookingStatusById(id)
  if (!booking) {
    redirect(`/dashboard/bookings`, RedirectType.replace)
  }

  //Expense can be modified for in-progress or completed bookings only
  //Only owner or booking assigned user can modify expenses (irrespective of who created the expense)
  if (
    ![BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
      booking.status,
    ) ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== booking.assignedUserId)
  ) {
    redirect(`/dashboard/bookings/${id}/expenses`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses/modify"} />
      <ModifyExpensePageComponent
        expenseDetails={expenseDetails}
        assignedUserId={booking.assignedUserId}
      />
    </MainWrapper>
  )
}
