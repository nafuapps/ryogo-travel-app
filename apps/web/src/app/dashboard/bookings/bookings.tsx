import OngoingBookingsComponent from "@/components/flows/bookings/home/ongoingBookingsComponent"
import CompletedBookingsComponent from "@/components/flows/bookings/home/completedBookingsComponent"
import UpcomingBookingsComponent from "@/components/flows/bookings/home/upcomingBookingsComponent"
import LeadBookingsComponent from "@/components/flows/bookings/home/leadBookingsComponent"
import BookingScheduleComponent from "@/components/flows/bookings/home/bookingScheduleComponent"
import BookingHistoryComponent from "@/components/flows/bookings/home/bookingHistoryComponent"
import { PageWrapper } from "@/components/page/pageWrappers"

/**
 * Ongoing Bookings
 * Upcoming Bookings
 * Completed Bookings
 * Open leads
 * Bookings schedule
 */

export default async function BookingsPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  return (
    <PageWrapper id="BookingsPage">
      <OngoingBookingsComponent agencyId={agencyId} />
      <UpcomingBookingsComponent agencyId={agencyId} />
      <CompletedBookingsComponent agencyId={agencyId} />
      <LeadBookingsComponent agencyId={agencyId} />
      <BookingScheduleComponent agencyId={agencyId} />
      <BookingHistoryComponent agencyId={agencyId} />
    </PageWrapper>
  )
}
