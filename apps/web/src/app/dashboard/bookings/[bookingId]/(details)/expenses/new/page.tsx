import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import NewExpensePageComponent from "./newExpense"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { redirect, RedirectType } from "next/navigation"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `New Booking Expense - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewExpensePage({
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
    redirect("/dashboard/bookings")
  }

  //Expense can be added for in-progress or completed bookings only
  //Only owner or assigned user can add expense
  if (
    ![BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
      booking.status,
    ) ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== booking.assignedUserId)
  ) {
    redirect(`/dashboard/bookings/${bookingId}/expenses`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses/new"} />
      <NewExpensePageComponent
        bookingId={bookingId}
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        assignedUserId={booking.assignedUserId}
      />
    </MainWrapper>
  )
}
