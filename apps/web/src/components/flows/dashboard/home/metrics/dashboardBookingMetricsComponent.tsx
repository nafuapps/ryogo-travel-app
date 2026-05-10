import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { TrendingUp, TrendingDown, Tickets } from "lucide-react"
import {
  DashboardMetricWrapper,
  DashboardMetricTopWrapper,
  DashboardMetricGridItem,
  DashboardMetricGridWrapper,
  DashboardMetricHeader,
  DashboardMetricMain,
  DashboardMetricSubTitle,
} from "./dashboardMetricsWrappers"
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

  return (
    <DashboardMetricWrapper>
      <DashboardMetricTopWrapper>
        <DashboardMetricHeader label={t("Title")} icon={Tickets} />
        <DashboardMetricMain mainValue={confirmed24HrsCount}>
          {confirmedWeeklyAvg !== 0 && (
            <DashboardMetricSubTitle
              icon={more ? TrendingUp : TrendingDown}
              subtitle={t("Subtitle", {
                createdChange: createdChange.toLocaleString("en-IN", {
                  style: "percent",
                  maximumFractionDigits: 1,
                }),
                more: more ? "more" : "less",
              })}
            />
          )}
        </DashboardMetricMain>
      </DashboardMetricTopWrapper>
      <DashboardMetricGridWrapper>
        <DashboardMetricGridItem
          label={t("Leads")}
          value={leadCount}
          borderBottom
        />
        <DashboardMetricGridItem
          label={t("Ongoing")}
          value={inProgressCount}
          borderLeft
          borderBottom
        />
        <DashboardMetricGridItem
          label={t("Cancelled")}
          value={cancelledCount}
        />
        <DashboardMetricGridItem
          label={t("Completed")}
          value={completedCount}
          borderLeft
        />
      </DashboardMetricGridWrapper>
    </DashboardMetricWrapper>
  )
}
