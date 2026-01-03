import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import UpcomingBookingsItemComponent from "./upcomingBookingsItemComponent"

export default async function UpcomingBookingsComponent() {
  const user = await getCurrentUser()

  const upcomingBookings7Days =
    await bookingServices.findUpcomingBookingsNextDays(user!.agencyId, 7)

  return (
    <UpcomingBookingsItemComponent
      upcomingBookings7Days={upcomingBookings7Days}
    />
  )
}
