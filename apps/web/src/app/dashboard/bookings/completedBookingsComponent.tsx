import { getCurrentUser } from "@/lib/auth";
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import { Suspense } from "react";
import CompletedBookingsItemComponent from "./completedBookingsItemComponent";

export default async function CompletedBookingsComponent() {
  const user = await getCurrentUser();

  const completedBookings7Days =
    bookingServices.findCompletedBookingsPreviousDays(user!.agencyId, 7);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompletedBookingsItemComponent
        completedBookings7Days={completedBookings7Days}
      />
    </Suspense>
  );
}
