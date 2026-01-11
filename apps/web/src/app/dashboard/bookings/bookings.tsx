import { pageClassName } from "@/components/page/pageCommons"
import OngoingBookingsComponent from "./(all)/ongoingBookingsComponent"
import CompletedBookingsComponent from "./(all)/completedBookingsComponent"
import UpcomingBookingsComponent from "./(all)/upcomingBookingsComponent"
import LeadBookingsComponent from "./(all)/leadBookingsComponent"
import BookingScheduleComponent from "./(all)/bookingScheduleComponent"

/*
 * Ongoing Bookings
 * Upcoming Bookings
 * Completed Bookings
 * Open leads
 * Bookings schedule
  TODO:Actions
  TODO:Bookings History (last 14 days)
 */

export default async function BookingsPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  return (
    <div id="BookingsPage" className={pageClassName}>
      <OngoingBookingsComponent agencyId={agencyId} />
      <CompletedBookingsComponent agencyId={agencyId} />
      <UpcomingBookingsComponent agencyId={agencyId} />
      <LeadBookingsComponent agencyId={agencyId} />
      <BookingScheduleComponent agencyId={agencyId} />
      {/*<BookingActionsComponent agencyId={agencyId}/> */}
      {/*<BookingsHistoryComponent agencyId={agencyId}/> */}
    </div>
  )
}
