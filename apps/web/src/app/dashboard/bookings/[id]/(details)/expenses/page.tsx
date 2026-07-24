import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import BookingExpensesPageComponent from "./bookingExpenses"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
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

  const bookingExpenses = await bookingServices.findBookingExpensesById(id)
  const assignedUserId = await bookingServices.findAssignedUserIdByBookingId(id)

  //Only booking assigned user or owner can create/modify expenses
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses"} />
      <BookingExpensesPageComponent
        bookingId={id}
        bookingExpenses={bookingExpenses}
        canCreateExpense={
          currentUser.userRole === UserRolesEnum.OWNER ||
          currentUser.userId === assignedUserId
        }
        canApproveExpense={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
