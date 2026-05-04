import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/dashboardHeader"
import BookingTripLogsPageComponent from "./bookingTripLogs"
import { Metadata } from "next"

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
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/trip-logs"} />
      <BookingTripLogsPageComponent
        bookingId={id}
        bookingTripLogs={bookingTripLogs}
      />
    </div>
  )
}
