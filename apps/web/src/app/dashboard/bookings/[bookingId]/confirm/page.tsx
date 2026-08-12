//bookings/id/confirm page (for lead booking)

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import ConfirmBookingPageComponent from "./confirmBooking"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Confirm Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function ConfirmBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  //Get current user
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Get lead booking details from DB
  const booking = await bookingServices.findLeadBookingById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Not a lead booking -> send to details page
  if (booking.status !== BookingStatusEnum.LEAD) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/confirm"} />
      <ConfirmBookingPageComponent
        booking={booking}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        isAssignedUser={booking.assignedUser.id === currentUser.userId}
      />
    </MainWrapper>
  )
}
