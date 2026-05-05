import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import CompletedBookingsItemComponent from "./completedBookingsItemComponent"

export default async function CompletedBookingsComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const completedBookings7Days =
    await bookingServices.findCompletedBookingsPreviousDays(agencyId, 7)

  return (
    <CompletedBookingsItemComponent
      completedBookings7Days={completedBookings7Days}
    />
  )
}
