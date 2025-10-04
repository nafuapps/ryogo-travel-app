import { getCurrentUser } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import {
  CaptionGrey,
  H4,
  H1,
  H5,
  H5Grey,
  PBold,
  PGrey,
} from "@/components/typography";
import {
  LucideTrendingUp,
  LucideTrendingDown,
  LucideShoppingBag,
  LucideShoppingCart,
} from "lucide-react";

export default async function DashboardBookingMetricsComponent() {
  const t = await getTranslations("Dashboard.Home.BookingMetrics");
  const user = await getCurrentUser();

  // //Get confirmed bookings
  // const confirmedBookingsThisWeek =
  //   await bookingServices.findConfirmedBookingsPreviousDays(user!.agencyId, 7);
  // const confirmed24HrsBookings = confirmedBookingsThisWeek.filter(
  //   (b) => b.createdAt > new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  // );

  // //Get In progress bookings
  // const inProgressBookings = await bookingServices.findInProgressBookings(
  //   user!.agencyId
  // );

  // //Get updated bookings with all the status (lead, completed, cancelled)
  // const updatedBookings = await bookingServices.findBookingsUpdatedPreviousDays(
  //   user!.agencyId
  // );

  const confirmedThisWeekCount = 15;
  const confirmed24HrsCount = 2;
  // const confirmedThisWeekCount = confirmedBookingsThisWeek.length;
  // const confirmed24HrsCount = confirmed24HrsBookings.length;

  const confirmedWeeklyAvg = confirmedThisWeekCount / 7;

  const more = confirmed24HrsCount > confirmedWeeklyAvg;
  const createdChange = more
    ? (confirmed24HrsCount - confirmedWeeklyAvg) / confirmedWeeklyAvg
    : (confirmedWeeklyAvg - confirmed24HrsCount) / confirmedWeeklyAvg;

  const inProgressCount = 3;

  const leadCount = 3;

  const completedCount = 6;

  const cancelledCount = 1;

  // const inProgress = inProgressBookings.length;

  // const leadCount = updatedBookings.filter(
  //   (b) => b.status === "lead"
  // ).length;

  // const completedCount = updatedBookings.filter(
  //   (b) => b.status === "completed"
  // ).length;

  // const cancelledCount = updatedBookings.filter(
  //   (b) => b.status === "cancelled"
  // ).length;

  const icon = more ? (
    <LucideTrendingUp className="text-slate-500 size-4 lg:size-5" />
  ) : (
    <LucideTrendingDown className="text-slate-500 size-4 lg:size-5" />
  );

  return (
    <div
      id="dashboardBookingMetrics"
      className="bg-white rounded-lg grid grid-cols-3 p-4 lg:p-5 gap-1 lg:gap-2"
    >
      <div
        id="dashboardBookingMetricsFirstCol"
        className="flex flex-col justify-start items-center gap-4 lg:gap-5"
      >
        <div
          id="dashboardBookingMetricsHeader"
          className="flex flex-row gap-2 items-center self-start"
        >
          <LucideShoppingCart className="text-slate-500 size-4 lg:size-5" />
          <PGrey>{t("Title")}</PGrey>
        </div>
        <div
          id="dashboardBookingMetricsConfirmed"
          className="flex flex-col flex-1 gap-3 lg:gap-4 items-center justify-end"
        >
          <H1>{confirmed24HrsCount}</H1>
          <div className="flex flex-col lg:gap-0.5 items-center">
            <div className="flex flex-row gap-1 item-center">
              {icon}
              <CaptionGrey>
                {createdChange.toLocaleString("en-IN", {
                  style: "percent",
                  maximumFractionDigits: 1,
                })}
              </CaptionGrey>
              <CaptionGrey>{more ? t("More") : t("Less")}</CaptionGrey>
            </div>
            <CaptionGrey>{t("ThanAvg")}</CaptionGrey>
          </div>
        </div>
      </div>
      <div
        id="dashboardBookingMetricsSecondCol"
        className="grid grid-rows-2 grid-cols-2 col-span-2"
      >
        <div
          id="dashboardBookingMetricsLeads"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-r border-slate-100"
        >
          <H4>{leadCount}</H4>
          <CaptionGrey>{t("Leads")}</CaptionGrey>
        </div>
        <div
          id="dashboardBookingMetricsInProgress"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center"
        >
          <H4>{inProgressCount}</H4>
          <CaptionGrey>{t("InProgress")}</CaptionGrey>
        </div>
        <div
          id="dashboardBookingMetricsCancelled"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-t border-r border-slate-100"
        >
          <H4>{cancelledCount}</H4>
          <CaptionGrey>{t("Cancelled")}</CaptionGrey>
        </div>
        <div
          id="dashboardBookingMetricsCompleted"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-t border-slate-100"
        >
          <H4>{completedCount}</H4>
          <CaptionGrey>{t("Completed")}</CaptionGrey>
        </div>
      </div>
    </div>
  );
}
