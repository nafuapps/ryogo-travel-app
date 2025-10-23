import { getCurrentUser } from "@/lib/auth";
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import { Suspense } from "react";
import LeadBookingsItemComponent from "./leadBookingsItemComponent";

export default async function LeadsBookingsComponent() {
  const user = await getCurrentUser();

  const leadBookings7Days = bookingServices.findLeadBookingsPreviousDays(
    user!.agencyId,
    7
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadBookingsItemComponent leadBookings7Days={leadBookings7Days} />
    </Suspense>
  );
}
