import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import BookingExpensesPageComponent from "./bookingExpenses"
import { getCurrentUser } from "@/lib/auth"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Booking Expenses - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingExpensesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const booking = await bookingServices.findBookingStatusById(id)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Expense can be created for in-progress or completed bookings only
  //Only owner or assigned user can create expenses
  const canCreateExpense =
    (currentUser.userRole === UserRolesEnum.OWNER ||
      currentUser.userId === booking.assignedUserId) &&
    [BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
      booking.status,
    )

  const bookingExpenses = await bookingServices.findBookingExpensesById(id)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses"} />
      <BookingExpensesPageComponent
        bookingId={id}
        bookingExpenses={bookingExpenses}
        canCreateExpense={canCreateExpense}
        canApproveExpense={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
