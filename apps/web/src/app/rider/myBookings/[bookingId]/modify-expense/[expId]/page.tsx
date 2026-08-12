import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import RiderModifyExpensePageComponent from "./riderModifyExpense"
import { ExpenseIdRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Modify Expense - ${pageTitle}`,
  description: pageDescription,
}

export default async function RiderModifyExpensePage({
  params,
}: {
  params: Promise<{ bookingId: string; expId: string }>
}) {
  const { bookingId, expId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Invalid expense id regex check
  if (!ExpenseIdRegex.safeParse(expId).success) {
    redirect(`/rider/myBookings/${bookingId}`, RedirectType.replace)
  }

  const expenseDetails = await expenseServices.findExpenseDetailsById(expId)

  //If no expense found, or bookingid/user/agency mismatch
  if (
    !expenseDetails ||
    expenseDetails.bookingId !== bookingId ||
    expenseDetails.addedByUserId !== currentUser.userId ||
    expenseDetails.agencyId !== currentUser.agencyId
  ) {
    redirect(`/rider/myBookings/${bookingId}`, RedirectType.replace)
  }

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }

  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  //Expense can be modified for in-progress booking only
  if (booking.status !== BookingStatusEnum.IN_PROGRESS) {
    redirect(`/rider/myBookings/${bookingId}`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings/[id]/modify-expense"} />
      <RiderModifyExpensePageComponent
        expenseDetails={expenseDetails}
        assignedUserId={booking.assignedUserId}
      />
    </MainWrapper>
  )
}
