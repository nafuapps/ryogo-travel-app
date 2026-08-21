import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import UpcomingBookingsItemComponent from "./upcomingBookingsItemComponent"

export default async function UpcomingBookingsComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const upcomingBookings14Days =
    await bookingServices.findUpcomingBookingsNextDays(agencyId, 14)

  return (
    <UpcomingBookingsItemComponent
      upcomingBookings14Days={upcomingBookings14Days}
    />
  )
}
