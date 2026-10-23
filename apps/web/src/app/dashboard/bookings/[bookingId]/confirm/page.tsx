import { autoCancelBookingAction } from "@/app/actions/bookings/autoCancelBookingAction"
import BookingTripCard from "@/components/flows/bookings/details/bookingTripCard"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { OLD_LEAD_AUTO_CANCEL_DAYS } from "@/lib/uiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import ConfirmBookingPageComponent from "./confirmBookingForm"

export const metadata: Metadata = {
  title: `Confirm Lead Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function ConfirmBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { bookingId } = await params

  //Get lead booking details from DB
  const booking = await bookingServices.findBookingDetailsById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Not a lead booking -> send to booking details page
  if (booking.status !== BookingStatusEnum.LEAD) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  //If it is an old lead booking, cancel it automatically
  if (
    differenceInDays(new Date(), booking.startDate) > OLD_LEAD_AUTO_CANCEL_DAYS
  ) {
    await autoCancelBookingAction({
      bookingId: booking.id,
      agencyId: booking.agencyId,
    })
  }

  //Only owner or assigned user can confirm a booking
  if (
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.userId !== booking.assignedUserId
  ) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/confirm"} />
      <ConfirmBookingPageComponent booking={booking}>
        <BookingTripCard {...booking} />
      </ConfirmBookingPageComponent>
    </MainWrapper>
  )
}
