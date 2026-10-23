import ModifyExpensePageComponent from "@/components/flows/bookings/expense/modifyExpensePage"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { ExpenseIdRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `Modify Booking Expense - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyExpensePage({
  params,
}: {
  params: Promise<{ bookingId: string; expId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { bookingId, expId } = await params

  //Invalid expense id regex check
  if (!ExpenseIdRegex.safeParse(expId).success) {
    redirect(`/dashboard/bookings/${bookingId}/expenses`, RedirectType.replace)
  }

  //Get expense details from DB
  const expenseDetails = await expenseServices.findExpenseDetailsById(expId)

  //If no expense found, or bookingId/agency mismatch
  if (
    !expenseDetails ||
    expenseDetails.bookingId !== bookingId ||
    expenseDetails.agencyId !== currentUser.agencyId
  ) {
    redirect(`/dashboard/bookings/${bookingId}/expenses`, RedirectType.replace)
  }

  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect(`/dashboard/bookings`, RedirectType.replace)
  }

  //Expense can be modified for confirmed, in-progress or completed bookings only
  //Only owner or booking assigned user can modify expenses (irrespective of who created the expense)
  if (
    ![
      BookingStatusEnum.CONFIRMED,
      BookingStatusEnum.IN_PROGRESS,
      BookingStatusEnum.COMPLETED,
    ].includes(booking.status) ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== booking.assignedUserId) ||
    booking.closedAt
  ) {
    redirect(`/dashboard/bookings/${bookingId}/expenses`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses/modify"} />
      <ModifyExpensePageComponent
        expenseDetails={expenseDetails}
        bookingAssignedUserId={booking.assignedUserId}
      />
    </MainWrapper>
  )
}
