import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { TransactionIdRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import ModifyTransactionPageComponent from "./modifyTransaction"

export const metadata: Metadata = {
  title: `Modify Booking Transaction - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyTransactionPage({
  params,
}: {
  params: Promise<{ bookingId: string; txnId: string }>
}) {
  const { bookingId, txnId } = await params

  //Invalid transaction id regex check
  if (!TransactionIdRegex.safeParse(txnId).success) {
    redirect(
      `/dashboard/bookings/${bookingId}/transactions`,
      RedirectType.replace,
    )
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Get txn details from DB
  const transactionDetails =
    await transactionServices.findTransactionDetailsById(txnId)

  //If no txn found, or bookingId/agency mismatch
  if (
    !transactionDetails ||
    transactionDetails.bookingId !== bookingId ||
    transactionDetails.agencyId !== currentUser.agencyId
  ) {
    redirect(
      `/dashboard/bookings/${bookingId}/transactions`,
      RedirectType.replace,
    )
  }

  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Txn can be modified for confirmed, in-progress or completed bookings only
  //Only owner or booking assigned user can modify transactions (for bookings that are not reconciled yet)
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
      <DashboardHeader
        pathName={"/dashboard/bookings/[id]/transactions/modify"}
      />
      <ModifyTransactionPageComponent
        transactionDetails={transactionDetails}
        assignedUserId={booking.assignedUserId}
      />
    </MainWrapper>
  )
}
