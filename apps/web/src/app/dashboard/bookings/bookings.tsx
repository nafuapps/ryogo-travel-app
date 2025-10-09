import { pageClassName } from "@/components/page/pageCommons";
import OngoingBookingsComponent from "./ongoingBookingsComponent";
import CompletedBookingsComponent from "./completedBookingsComponent";
import UpcomingBookingsComponent from "./upcomingBookingsComponent";
import LeadBookingsComponent from "./leadBookingsComponent";
import BookingScheduleComponent from "./bookingScheduleComponent";

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
