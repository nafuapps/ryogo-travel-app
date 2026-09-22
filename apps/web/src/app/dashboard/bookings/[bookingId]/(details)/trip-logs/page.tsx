import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import BookingTripLogsPageComponent from "./bookingTripLogs"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import BookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"

export const metadata: Metadata = {
  title: `Booking Trip Logs - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  const bookingTripLogs =
    await bookingServices.findBookingTripLogsById(bookingId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/trip-logs"} />
      <PageWrapper id="BookingTripLogsPage">
        <BookingDetailHeaderTabs id={bookingId} selectedTab="TripLogs" />
        <BookingTripLogsPageComponent bookingTripLogs={bookingTripLogs} />
      </PageWrapper>
    </MainWrapper>
  )
}
