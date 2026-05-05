import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import LeadBookingsItemComponent from "./leadBookingsItemComponent"

export default async function LeadsBookingsComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const leadBookings7Days = await bookingServices.findLeadBookingsPreviousDays(
    agencyId,
    7
  )

  return <LeadBookingsItemComponent leadBookings7Days={leadBookings7Days} />
}
