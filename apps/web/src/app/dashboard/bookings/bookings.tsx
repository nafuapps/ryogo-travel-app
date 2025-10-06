import { pageClassName } from "@/components/page/pageCommons";
import OngoingBookingsComponent from "./ongoingBookingsComponent";
import CompletedBookingsComponent from "./completedBookingsComponent";
import UpcomingBookingsComponent from "./upcomingBookingsComponent";
import LeadBookingsComponent from "./leadBookingsComponent";

/*
 * Ongoing Bookings
 * Bookings schedule
 * Upcoming Bookings
 * Completed Bookings
 * Open leads
 * Actions
 */

export default function BookingsPageComponent() {
  return (
    <div id="BookingsPage" className={pageClassName}>
      <OngoingBookingsComponent />
      <CompletedBookingsComponent />
      <UpcomingBookingsComponent />
      <LeadBookingsComponent />
      {/* <BookingsScheduleComponent/>
      <BookingActionsComponent/> */}
    </div>
  );
}
