import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/dashboardHeader"
import NewTransactionPageComponent from "./newTransaction"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `New Booking Transaction - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }
  //Only owner or assigned user can add transactions
  if (
    user.userRole !== UserRolesEnum.OWNER &&
    user.userId !== bookingDetails.assignedUserId
  ) {
    redirect(`/dashboard/bookings/${id}/transactions`, RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/transactions/new"} />
      <NewTransactionPageComponent
        bookingId={id}
        userId={user.userId}
        agencyId={user.agencyId}
        assignedUserId={bookingDetails.assignedUserId}
      />
    </div>
  )
}
