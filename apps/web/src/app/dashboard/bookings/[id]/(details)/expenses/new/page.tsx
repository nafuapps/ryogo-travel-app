import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import NewExpensePageComponent from "./newExpense"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `New Booking Expense - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewExpensePage({
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
    redirect("/dashboard/bookings")
  }

  //Only owner or assigned user can add expense
  if (
    currentUser.userRole !== UserRolesEnum.OWNER &&
    currentUser.userId !== bookingDetails.assignedUserId
  ) {
    redirect(`/dashboard/bookings/${id}/expenses`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses/new"} />
      <NewExpensePageComponent
        bookingId={id}
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        assignedUserId={bookingDetails.assignedUserId}
      />
    </MainWrapper>
  )
}
