import DashboardHeader from "@/components/header/dashboardHeader"
import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { redirect, RedirectType } from "next/navigation"
import ModifyTransactionPageComponent from "./modifyTransaction"
import { TransactionRegex } from "@/lib/regex"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"

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
  if (!TransactionRegex.safeParse(txnId).success) {
    redirect(`/dashboard/bookings/${id}/transactions`, RedirectType.replace)
  }

  const user = await getCurrentUser()
  if (!user) {
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
    (user.userRole !== UserRolesEnum.OWNER &&
      user.userId !== bookingDetails.assignedUserId)
  ) {
    redirect(`/dashboard/bookings/${id}/transactions`, RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader
        pathName={"/dashboard/bookings/[id]/transactions/modify"}
      />
      <ModifyTransactionPageComponent
        transactionDetails={transactionDetails}
        assignedUserId={bookingDetails.assignedUserId}
      />
    </div>
  )
}
