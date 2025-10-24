import { pageClassName } from "@/components/page/pageCommons";
import OngoingBookingsComponent from "./(all)/ongoingBookingsComponent";
import CompletedBookingsComponent from "./(all)/completedBookingsComponent";
import UpcomingBookingsComponent from "./(all)/upcomingBookingsComponent";
import LeadBookingsComponent from "./(all)/leadBookingsComponent";
import BookingScheduleComponent from "./(all)/bookingScheduleComponent";

/*
 * Ongoing Bookings
 * Upcoming Bookings
 * Completed Bookings
 * Open leads
 * Bookings schedule
  TODO:Actions
  TODO:Daily trips (last 14 days)
 */

export default function BookingsPageComponent() {
  return (
    <div id="BookingsPage" className={pageClassName}>
      <OngoingBookingsComponent />
      <CompletedBookingsComponent />
      <UpcomingBookingsComponent />
      <LeadBookingsComponent />
      <BookingScheduleComponent />
      {/*<BookingActionsComponent/> */}
    </div>
  );
}
