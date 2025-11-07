//Booking/id/trip_logs page

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import BookingTripLogsPageComponent from "./bookingTripLogs"

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
