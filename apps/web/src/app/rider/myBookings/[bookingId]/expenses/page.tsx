import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import MyBookingExpensesPageComponent from "./myBookingExpenses"
import RiderHeader from "@/components/header/riderHeader"

export const metadata: Metadata = {
  title: `My Booking Expenses - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyBookingExpensesPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  //Expense can be created for in-progress bookings only by driver
  const canCreateExpense = BookingStatusEnum.IN_PROGRESS === booking.status

  const bookingExpenses =
    await bookingServices.findBookingExpensesById(bookingId)

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings/[id]/expenses"} />
      <MyBookingExpensesPageComponent
        userId={currentUser.userId}
        bookingId={bookingId}
        bookingExpenses={bookingExpenses}
        canCreateExpense={canCreateExpense}
      />
    </MainWrapper>
  )
}
