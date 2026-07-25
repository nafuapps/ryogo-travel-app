import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { redirect, RedirectType } from "next/navigation"
import ModifyTransactionPageComponent from "./modifyTransaction"
import { TransactionIdRegex } from "@/lib/regex"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Modify Booking Transaction - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyTransactionPage({
  params,
}: {
  params: Promise<{ id: string; txnId: string }>
}) {
  const { id, txnId } = await params

  //Invalid transaction id regex check
  if (!TransactionIdRegex.safeParse(txnId).success) {
    redirect(`/dashboard/bookings/${id}/transactions`, RedirectType.replace)
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }
  const transactionDetails =
    await transactionServices.findTransactionDetailsById(txnId)

  //Only owner or assigned user can modify transactions
  if (
    !transactionDetails ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== bookingDetails.assignedUserId)
  ) {
    redirect(`/dashboard/bookings/${id}/transactions`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader
        pathName={"/dashboard/bookings/[id]/transactions/modify"}
      />
      <ModifyTransactionPageComponent
        transactionDetails={transactionDetails}
        assignedUserId={bookingDetails.assignedUserId}
      />
    </MainWrapper>
  )
}
