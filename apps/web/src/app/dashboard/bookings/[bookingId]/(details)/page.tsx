import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import BookingDetailsPageComponent from "./bookingDetails"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Booking Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)

  if (!bookingDetails) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]"} />
      <BookingDetailsPageComponent
        bookingDetails={bookingDetails}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        isAssignedUser={bookingDetails.assignedUser.id === currentUser.userId}
      />
    </MainWrapper>
  )
}
