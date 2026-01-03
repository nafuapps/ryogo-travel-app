import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import LeadBookingsItemComponent from "./leadBookingsItemComponent"

export default async function LeadsBookingsComponent() {
  const user = await getCurrentUser()

  const leadBookings7Days = await bookingServices.findLeadBookingsPreviousDays(
    user!.agencyId,
    7
  )

  return <LeadBookingsItemComponent leadBookings7Days={leadBookings7Days} />
}
