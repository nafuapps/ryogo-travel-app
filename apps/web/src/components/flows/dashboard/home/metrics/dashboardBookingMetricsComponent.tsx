import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  RyogoCaption,
  RyogoH3,
  RyogoSmall,
  RyogoH2,
} from "@/components/typography"
import { TrendingUp, TrendingDown, Tickets } from "lucide-react"
import {
  metricsClassName,
  metricFirstRowClassName,
  metricHeaderClassName,
  metricMainClassName,
  metricItem1ClassName,
  metricSecondRowClassName,
  metricItem2ClassName,
  metricItem3ClassName,
  metricItem4ClassName,
} from "./dashboardMetricsCommons"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

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
    <RyogoIcon icon={TrendingUp} size="sm" />
  ) : (
    <RyogoIcon icon={TrendingDown} size="sm" />
  )

  return (
    <div id="dashboardBookingMetrics" className={metricsClassName}>
      <div
        id="dashboardBookingMetricsFirstCol"
        className={metricFirstRowClassName}
      >
        <div
          id="dashboardBookingMetricsHeader"
          className={metricHeaderClassName}
        >
          <RyogoIcon icon={Tickets} size="sm" />
          <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
        </div>
        <div
          id="dashboardBookingMetricsConfirmed"
          className={metricMainClassName}
        >
          <RyogoH2>{confirmed24HrsCount}</RyogoH2>
          {confirmedWeeklyAvg !== 0 && (
            <div className="flex flex-col lg:gap-0.5 items-center text-center">
              <div className="flex flex-row gap-1 item-center">
                {icon}
                <RyogoCaption color="light">
                  {createdChange.toLocaleString("en-IN", {
                    style: "percent",
                    maximumFractionDigits: 1,
                  })}
                </RyogoCaption>
                <RyogoCaption color="light">
                  {more ? t("More") : t("Less")}
                </RyogoCaption>
              </div>
              <RyogoCaption color="light">{t("ThanAvg")}</RyogoCaption>
            </div>
          )}
        </div>
      </div>
      <div
        id="dashboardBookingMetricsSecondCol"
        className={metricSecondRowClassName}
      >
        <div id="dashboardBookingMetricsLeads" className={metricItem1ClassName}>
          <RyogoH3>{leadCount}</RyogoH3>
          <RyogoCaption color="light">{t("Leads")}</RyogoCaption>
        </div>
        <div
          id="dashboardBookingMetricsInProgress"
          className={metricItem2ClassName}
        >
          <RyogoH3>{inProgressCount}</RyogoH3>
          <RyogoCaption color="light">{t("Ongoing")}</RyogoCaption>
        </div>
        <div
          id="dashboardBookingMetricsCancelled"
          className={metricItem3ClassName}
        >
          <RyogoH3>{cancelledCount}</RyogoH3>
          <RyogoCaption color="light">{t("Cancelled")}</RyogoCaption>
        </div>
        <div
          id="dashboardBookingMetricsCompleted"
          className={metricItem4ClassName}
        >
          <RyogoH3>{completedCount}</RyogoH3>
          <RyogoCaption color="light">{t("Completed")}</RyogoCaption>
        </div>
      </div>
    </div>
  )
}
