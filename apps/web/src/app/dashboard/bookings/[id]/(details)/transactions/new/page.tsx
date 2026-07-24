import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import NewTransactionPageComponent from "./newTransaction"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

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
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }
  //Only owner or assigned user can add transactions
  if (
    currentUser.userRole !== UserRolesEnum.OWNER &&
    currentUser.userId !== bookingDetails.assignedUserId
  ) {
    redirect(`/dashboard/bookings/${id}/transactions`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/transactions/new"} />
      <NewTransactionPageComponent
        bookingId={id}
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        assignedUserId={bookingDetails.assignedUserId}
      />
    </MainWrapper>
  )
}
