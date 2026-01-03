import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import BookingScheduleChartComponent from "./bookingScheduleChartComponent"

export default async function BookingScheduleComponent() {
  const user = await getCurrentUser()

  const bookings14Days = await bookingServices.findScheduleNextDays(
    user!.agencyId,
    14
  )

  return <BookingScheduleChartComponent bookings14Days={bookings14Days} />
}
