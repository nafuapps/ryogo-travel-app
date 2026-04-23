import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import BookingDetailsPageComponent from "./bookingDetails"
import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/common/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Booking Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingDetailsPage({
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

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]"} />
      <BookingDetailsPageComponent
        bookingDetails={bookingDetails}
        isOwner={user.userRole === UserRolesEnum.OWNER}
        isAssignedUser={bookingDetails.assignedUser.id === user.userId}
      />
    </div>
  )
}
