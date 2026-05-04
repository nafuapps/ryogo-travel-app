import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import BookingTripLogsPageComponent from "./bookingTripLogs"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Booking Trip Logs - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const bookingTripLogs = await bookingServices.findBookingTripLogsById(id)
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/trip-logs"} />
      <BookingTripLogsPageComponent
        bookingId={id}
        bookingTripLogs={bookingTripLogs}
      />
    </MainWrapper>
  )
}
