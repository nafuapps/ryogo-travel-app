import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { redirect, RedirectType } from "next/navigation"
import ModifyTransactionPageComponent from "./modifyTransaction"
import { TransactionRegex } from "@/lib/regex"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

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

  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  const transactionDetails =
    await transactionServices.getTransactionDetailsById(txnId)

  //Only owner or assigned user can modify transactions
  if (
    !user ||
    !transactionDetails ||
    (user?.userRole != UserRolesEnum.OWNER &&
      user?.userId != bookingDetails?.assignedUser.id)
  ) {
    console.log({ user })
    redirect(`/dashboard/bookings/${id}/transactions`, RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader
        pathName={"/dashboard/bookings/[id]/transactions/modify"}
      />
      <ModifyTransactionPageComponent transactionDetails={transactionDetails} />
    </div>
  )
}
