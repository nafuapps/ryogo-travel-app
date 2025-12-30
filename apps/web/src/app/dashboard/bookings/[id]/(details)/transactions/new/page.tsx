//Bookings/id/transactions/new page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import NewTransactionPageComponent from "./newTransaction"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { redirect, RedirectType } from "next/navigation"

export default async function NewTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  const bookingDetails = await bookingServices.findBookingDetailsById(id)

  //Only owner or assigned user can add transactions
  if (
    !user ||
    (user?.userRole !== "owner" &&
      user?.userId !== bookingDetails?.assignedUser.id)
  ) {
    console.log({ user })
    redirect(`/dashboard/bookings/${id}/transactions`, RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/transactions/new"} />
      <NewTransactionPageComponent
        bookingId={id}
        userId={user?.userId}
        agencyId={user?.agencyId}
      />
    </div>
  )
}
