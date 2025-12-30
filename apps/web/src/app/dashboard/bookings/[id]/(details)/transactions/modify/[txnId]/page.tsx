import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { redirect, RedirectType } from "next/navigation"
import ModifyTransactionPageComponent from "./modifyTransaction"

export default async function ModifyTransactionPage({
  params,
}: {
  params: Promise<{ id: string; txnId: string }>
}) {
  const { id, txnId } = await params

  const user = await getCurrentUser()

  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  const transactionDetails =
    await transactionServices.getTransactionDetailsById(txnId)

  //Only owner or assigned user can modify transactions
  if (
    !user ||
    !transactionDetails ||
    (user?.userRole !== "owner" &&
      user?.userId !== bookingDetails?.assignedUser.id)
  ) {
    console.log({ user })
    redirect(`/dashboard/bookings/${id}/transactions`, RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader
        pathName={"/dashboard/bookings/[id]/transactions/modify"}
      />
      <ModifyTransactionPageComponent
        bookingId={id}
        transactionId={txnId}
        transactionDetails={transactionDetails}
      />
    </div>
  )
}
