import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import NewTransactionPageComponent from "./newTransaction"

export const metadata: Metadata = {
  title: `New Booking Transaction - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewTransactionPage({
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
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Txn can be added for confirmed, in-progress or completed bookings only
  //Only owner or assigned user can add transactions (for bookings that are not reconciled yet)
  if (
    ![
      BookingStatusEnum.CONFIRMED,
      BookingStatusEnum.IN_PROGRESS,
      BookingStatusEnum.COMPLETED,
    ].includes(booking.status) ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== booking.assignedUserId) ||
    booking.reconciledAt
  ) {
    redirect(
      `/dashboard/bookings/${bookingId}/transactions`,
      RedirectType.replace,
    )
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/transactions/new"} />
      <NewTransactionPageComponent
        bookingId={bookingId}
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        assignedUserId={booking.assignedUserId}
      />
    </MainWrapper>
  )
}
