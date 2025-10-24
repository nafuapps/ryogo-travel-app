//Bookings/id (details) page

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import BookingDetailsPageComponent from "./bookingDetails";
import { mainClassName } from "@/components/page/pageCommons";
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader";

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await bookingServices.findBookingById(id);
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]"} />
      <BookingDetailsPageComponent booking={booking} />
    </div>
  );
}
