import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { CaptionGrey, H4, H1, PGrey } from "@/components/typography"
import {
  LucideTrendingUp,
  LucideTrendingDown,
  LucideTickets,
} from "lucide-react"
import {
  metricsClassName,
  metricFirstColClassName,
  metricHeaderClassName,
  metricMainClassName,
  metricItem1ClassName,
  metricSecondColClassName,
  metricItem2ClassName,
  metricItem3ClassName,
  metricItem4ClassName,
  iconClassName,
  boldIconClassName,
} from "./dashboardMetricsCommons"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function DashboardBookingMetricsComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.BookingMetrics")

  //Get confirmed bookings
  const confirmedBookingsThisWeek =
    await bookingServices.findConfirmedBookingsPreviousDays(agencyId, 7)
  const confirmed24HrsBookings = confirmedBookingsThisWeek.filter(
    (b) => b.createdAt > new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  )

  //Get In progress bookings
  const inProgressBookings =
    await bookingServices.findInProgressBookings(agencyId)

  //Get updated bookings with all the status (lead, completed, cancelled)
  const updatedBookings =
    await bookingServices.findBookingsUpdatedPreviousDays(agencyId)

  const confirmedThisWeekCount = confirmedBookingsThisWeek.length
  const confirmed24HrsCount = confirmed24HrsBookings.length

  const confirmedWeeklyAvg = confirmedThisWeekCount / 7

  const more = confirmed24HrsCount > confirmedWeeklyAvg
  const createdChange = more
    ? (confirmed24HrsCount - confirmedWeeklyAvg) / confirmedWeeklyAvg
    : (confirmedWeeklyAvg - confirmed24HrsCount) / confirmedWeeklyAvg

  const inProgressCount = inProgressBookings.length

  const leadCount = updatedBookings.filter(
    (b) => b.status === BookingStatusEnum.LEAD,
  ).length

  const completedCount = updatedBookings.filter(
    (b) => b.status === BookingStatusEnum.COMPLETED,
  ).length

  const cancelledCount = updatedBookings.filter(
    (b) => b.status === BookingStatusEnum.CANCELLED,
  ).length

  const icon = more ? (
    <LucideTrendingUp className={boldIconClassName} />
  ) : (
    <LucideTrendingDown className={boldIconClassName} />
  )

  return (
    <div id="dashboardBookingMetrics" className={metricsClassName}>
      <div
        id="dashboardBookingMetricsFirstCol"
        className={metricFirstColClassName}
      >
        <div
          id="dashboardBookingMetricsHeader"
          className={metricHeaderClassName}
        >
          <LucideTickets className={iconClassName} />
          <PGrey>{t("Title")}</PGrey>
        </div>
        <div
          id="dashboardBookingMetricsConfirmed"
          className={metricMainClassName}
        >
          <H1>{confirmed24HrsCount}</H1>
          <div className="flex flex-col lg:gap-0.5 items-center text-center">
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
        className={metricSecondColClassName}
      >
        <div id="dashboardBookingMetricsLeads" className={metricItem1ClassName}>
          <H4>{leadCount}</H4>
          <CaptionGrey>{t("Leads")}</CaptionGrey>
        </div>
        <div
          id="dashboardBookingMetricsInProgress"
          className={metricItem2ClassName}
        >
          <H4>{inProgressCount}</H4>
          <CaptionGrey>{t("Ongoing")}</CaptionGrey>
        </div>
        <div
          id="dashboardBookingMetricsCancelled"
          className={metricItem3ClassName}
        >
          <H4>{cancelledCount}</H4>
          <CaptionGrey>{t("Cancelled")}</CaptionGrey>
        </div>
        <div
          id="dashboardBookingMetricsCompleted"
          className={metricItem4ClassName}
        >
          <H4>{completedCount}</H4>
          <CaptionGrey>{t("Completed")}</CaptionGrey>
        </div>
      </div>
    </div>
  )
}
