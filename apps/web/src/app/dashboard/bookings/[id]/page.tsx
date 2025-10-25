//Bookings/id (details) page

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import BookingDetailsPageComponent from "./bookingDetails";
import { mainClassName } from "@/components/page/pageCommons";
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader";
import { BookingRegex } from "@/lib/regex";
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema";
import { redirect, RedirectType } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  //Invalid booking id regex check
  if (!BookingRegex.safeParse(id).success) {
    redirect("/dashboard/bookings", RedirectType.replace);
  }

  //No booking found or agency mismatch
  const booking = await bookingServices.findBookingDetailsById(id);
  if (!booking || booking.agency.id !== user?.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace);
  }

  //Lead booking -> send to confirm page
  if (booking?.status == BookingStatusEnum.LEAD) {
    redirect(`/dashboard/bookings/${id}/confirm`, RedirectType.replace);
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]"} />
      <BookingDetailsPageComponent
        booking={booking}
        isOwner={user.userRole === "owner"}
      />
    </div>
  );
}
