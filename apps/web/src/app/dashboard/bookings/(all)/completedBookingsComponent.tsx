import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import CompletedBookingsItemComponent from "./completedBookingsItemComponent"

export default async function CompletedBookingsComponent() {
  const user = await getCurrentUser()

  const completedBookings7Days =
    await bookingServices.findCompletedBookingsPreviousDays(user!.agencyId, 7)

  return (
    <CompletedBookingsItemComponent
      completedBookings7Days={completedBookings7Days}
    />
  )
}
