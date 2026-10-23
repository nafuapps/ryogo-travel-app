import NewExpensePageComponent from "@/components/flows/bookings/expense/newExpensePage"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `Add Expense - ${pageTitle}`,
  description: pageDescription,
}

export default async function RiderAddExpensePage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { bookingId } = await params

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (!bookingDetails || bookingDetails.assignedDriver === null) {
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
        assignedUserId={bookingDetails.assignedDriver.userId}
        isRider
      />
    </MainWrapper>
  )
}
