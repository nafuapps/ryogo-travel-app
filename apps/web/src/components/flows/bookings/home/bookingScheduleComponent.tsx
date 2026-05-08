import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import BookingScheduleChartComponent from "./bookingScheduleChartComponent"

export default async function BookingScheduleComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const bookings14Days = await bookingServices.findBookingsScheduleNextDays(
    agencyId,
    14
  )

  return <BookingScheduleChartComponent bookings14Days={bookings14Days} />
}
