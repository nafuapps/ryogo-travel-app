import { getCurrentUser } from "@/lib/auth";
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import { Suspense } from "react";
import BookingScheduleChartComponent from "./bookingScheduleChartComponent";

export default async function BookingScheduleComponent() {
  const user = await getCurrentUser();

  const bookings14Days = bookingServices.findUpcomingBookingsNextDays(
    user!.agencyId,
    14
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingScheduleChartComponent bookings14Days={bookings14Days} />
    </Suspense>
  );
}
