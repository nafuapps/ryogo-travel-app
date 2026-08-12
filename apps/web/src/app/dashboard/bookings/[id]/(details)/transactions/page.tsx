import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import BookingTransactionsPageComponent from "./bookingTransactions"
import { getCurrentUser } from "@/lib/auth"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Booking Transactions - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingTransactionsPage({
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

  //Txn can be created for in-progress or completed bookings only
  //Only owner or assigned user can create transactions
  const canCreateTransaction =
    (currentUser.userRole === UserRolesEnum.OWNER ||
      currentUser.userId === booking.assignedUserId) &&
    [BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
      booking.status,
    )

  const bookingTransactions =
    await bookingServices.findBookingTransactionsById(id)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/transactions"} />
      <BookingTransactionsPageComponent
        bookingId={id}
        bookingTransactions={bookingTransactions}
        canCreateTransaction={canCreateTransaction}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
