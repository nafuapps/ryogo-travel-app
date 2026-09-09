import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { redirect, RedirectType } from "next/navigation"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import RiderHeader from "@/components/header/riderHeader"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import NewExpensePageComponent from "@/components/flows/bookings/expense/newExpensePage"

export const metadata: Metadata = {
  title: `Add Expense - ${pageTitle}`,
  description: pageDescription,
}

export default async function RiderAddExpensePage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const bookingDetails = await bookingServices.findBookingStatusById(bookingId)
  if (!bookingDetails || bookingDetails.assignedDriverId === null) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  //Driver can add expense for in progress booking only
  if (bookingDetails.status !== BookingStatusEnum.IN_PROGRESS) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings/[id]/expenses/add"} />
      <NewExpensePageComponent
        bookingId={bookingDetails.id}
        agencyId={bookingDetails.agencyId}
        userId={currentUser.userId}
        assignedUserId={bookingDetails.assignedUserId}
        isRider
      />
    </MainWrapper>
  )
}
