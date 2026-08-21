import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import CompletedBookingsItemComponent from "./completedBookingsItemComponent"

export default async function CompletedBookingsComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const completedBookings14Days =
    await bookingServices.findCompletedBookingsPreviousDays(agencyId, 14)

  return (
    <CompletedBookingsItemComponent
      completedBookings14Days={completedBookings14Days}
    />
  )
}
