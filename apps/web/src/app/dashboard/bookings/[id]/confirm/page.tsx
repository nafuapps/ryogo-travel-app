//bookings/id/confirm page (for lead booking)

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import ConfirmBookingComponent from "./confirmBookingComponent";
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema";
import { redirect, RedirectType } from "next/navigation";
import { BookingRegex } from "@/lib/regex";
import { toast } from "sonner";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import { mainClassName } from "@/components/page/pageCommons";
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader";

export default async function ConfirmBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const t = await getTranslations("Dashboard.ConfirmBooking");

  //Invalid booking id regex
  if (!BookingRegex.safeParse(id).success) {
    toast.warning(t("IdError"));
    redirect("/dashboard/bookings", RedirectType.replace);
  }

  //No booking found or agency mismatch
  const booking = await bookingServices.findBookingById(id);
  if (!booking || booking.agency.id !== user?.agencyId) {
    toast.error(t("NotFoundError"));
    redirect("/dashboard/bookings", RedirectType.replace);
  }

  //Not a lead booking -> send to details page
  if (booking?.status !== BookingStatusEnum.LEAD) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace);
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/confirm"} />
      <ConfirmBookingComponent booking={booking} />
    </div>
  );
}
