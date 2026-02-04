//MyBookings/[id]/Modify-expense page

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/app/rider/components/riderHeader"
import RiderModifyExpensePageComponent from "./riderModifyExpense"
import { ExpenseRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function RiderModifyExpensePage({
  params,
}: {
  params: Promise<{ id: string; expId: string }>
}) {
  const { id, expId } = await params
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Invalid expense id regex check
  if (!ExpenseRegex.safeParse(expId).success) {
    redirect(`/rider/myBookings/${id}`, RedirectType.replace)
  }

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }

  const expenseDetails = await expenseServices.findExpenseDetailsById(expId)
  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  //Driver can modify expense which was added by him and for in progress booking only
  if (
    !bookingDetails ||
    !expenseDetails ||
    bookingDetails.status !== BookingStatusEnum.IN_PROGRESS ||
    expenseDetails.addedByUserId !== driver.userId
  ) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myBookings/[id]/modify-expense"} />
      <RiderModifyExpensePageComponent expenseDetails={expenseDetails} />
    </div>
  )
}
