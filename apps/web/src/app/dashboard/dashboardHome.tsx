import DashboardBookingMetricsComponent from "@/components/flows/dashboard/home/metrics/dashboardBookingMetricsComponent"
import DashboardDriverMetricsComponent from "@/components/flows/dashboard/home/metrics/dashboardDriverMetricsComponent"
import DashboardRevenueMetricsComponent from "@/components/flows/dashboard/home/metrics/dashboardRevenueMetricComponent"
import DashboardVehicleMetricsComponent from "@/components/flows/dashboard/home/metrics/dashboardVehicleMetricsComponent"
import DashboardOngoingTripSection from "@/components/flows/dashboard/home/ongoingTrips/dashboardOngoingTripSection"
import { PageWrapper } from "@/components/page/pageWrappers"

/*
 * Bookings - Confirmed (Lead, In progress, Completed, Cancelled)
 * Vehicles - total (Available, In trip, Repair, Inactive)
 * Drivers - total (Available, In trip, Leave, Inactive)
 * Revenue - Last 24 hrs [based on confirmed bookings] (Transactions In/out  )
 * Ongoing trips list
 * // TODO: Critical Actions to be taken
 * // TODO: Graph - Bookings in the last 7/15/30 days
 */

export default function DashboardHomePageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  return (
    <PageWrapper id="DashboardPage">
      <div
        id="DashboardMetricsSection"
        className="grid gap-2 lg:gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      >
        <DashboardBookingMetricsComponent agencyId={agencyId} />
        <DashboardRevenueMetricsComponent agencyId={agencyId} />
        <DashboardVehicleMetricsComponent agencyId={agencyId} />
        <DashboardDriverMetricsComponent agencyId={agencyId} />
      </div>
      <DashboardOngoingTripSection agencyId={agencyId} />
    </PageWrapper>
  )
}
