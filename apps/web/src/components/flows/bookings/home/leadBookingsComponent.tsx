import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import LeadBookingsItemComponent from "./leadBookingsItemComponent"

export default async function LeadsBookingsComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const leadBookings14Days = await bookingServices.findLeadBookingsNextDays(
    agencyId,
    14,
  )

  return <LeadBookingsItemComponent leadBookings14Days={leadBookings14Days} />
}
