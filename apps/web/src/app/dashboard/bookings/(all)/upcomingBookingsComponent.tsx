import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import UpcomingBookingsItemComponent from "./upcomingBookingsItemComponent"

export default async function UpcomingBookingsComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const upcomingBookings7Days =
    await bookingServices.findUpcomingBookingsNextDays(agencyId, 7)

  return (
    <UpcomingBookingsItemComponent
      upcomingBookings7Days={upcomingBookings7Days}
    />
  )
}
