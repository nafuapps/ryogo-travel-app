//Bookings/id/expenses/new page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/common/dashboardHeader"
import NewExpensePageComponent from "./newExpense"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Booking Expense - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function NewExpensePage({
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
    redirect("/dashboard/bookings")
  }

  //Only owner or assigned user can add expense
  if (
    user.userRole !== UserRolesEnum.OWNER &&
    user.userId !== bookingDetails.assignedUserId
  ) {
    redirect(`/dashboard/bookings/${id}/expenses`, RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses/new"} />
      <NewExpensePageComponent
        bookingId={id}
        userId={user.userId}
        agencyId={user.agencyId}
        assignedUserId={bookingDetails.assignedUserId}
      />
    </div>
  )
}
