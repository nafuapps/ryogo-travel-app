import OngoingBookingsComponent from "@/components/bookings/home/ongoingBookingsComponent"
import CompletedBookingsComponent from "@/components/bookings/home/completedBookingsComponent"
import UpcomingBookingsComponent from "@/components/bookings/home/upcomingBookingsComponent"
import LeadBookingsComponent from "@/components/bookings/home/leadBookingsComponent"
import BookingScheduleComponent from "@/components/bookings/home/bookingScheduleComponent"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { PageWrapper } from "@/components/page/pageWrappers"

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
  const ongoingTrips = await bookingServices.findOngoingTrips(agencyId)
  return (
    <PageWrapper id="BookingsPage">
      <OngoingBookingsComponent ongoingTrips={ongoingTrips} />
      <CompletedBookingsComponent agencyId={agencyId} />
      <UpcomingBookingsComponent agencyId={agencyId} />
      <LeadBookingsComponent agencyId={agencyId} />
      <BookingScheduleComponent agencyId={agencyId} />
      {/*<BookingActionsComponent agencyId={agencyId}/> */}
      {/*<BookingsHistoryComponent agencyId={agencyId}/> */}
    </PageWrapper>
  )
}
