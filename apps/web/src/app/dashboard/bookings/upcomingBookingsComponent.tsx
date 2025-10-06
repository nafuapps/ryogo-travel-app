import { getCurrentUser } from "@/lib/auth";
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import { Suspense } from "react";
import UpcomingBookingsItemComponent from "./upcomingBookingsItemComponent";

export default async function UpcomingBookingsComponent() {
  const user = await getCurrentUser();

  const upcomingBookings7Days =
    bookingServices.findUpcomingBookingsPreviousDays(user!.agencyId, 7);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpcomingBookingsItemComponent
        upcomingBookings7Days={upcomingBookings7Days}
      />
    </Suspense>
  );
}
