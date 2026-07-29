import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import BookingHistoryChartComponent from "./bookingHistoryChartComponent"

export default async function BookingScheduleComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const bookingsHistory14Days =
    await bookingServices.findBookingsHistoryLastDays(agencyId, 14)

  if (bookingsHistory14Days.length === 0) {
    return <></>
  }

  return (
    <BookingHistoryChartComponent
      bookingsHistory14Days={bookingsHistory14Days}
    />
  )
}
