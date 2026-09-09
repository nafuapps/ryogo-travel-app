import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import MyBookingTripLogsPageComponent from "./myBookingTripLogs"

export const metadata: Metadata = {
  title: `My Booking Trip Logs - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyBookingTripLogsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  const bookingTripLogs =
    await bookingServices.findBookingTripLogsById(bookingId)

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings/[id]/trip-logs"} />
      <MyBookingTripLogsPageComponent
        bookingId={bookingId}
        bookingTripLogs={bookingTripLogs}
      />
    </MainWrapper>
  )
}
