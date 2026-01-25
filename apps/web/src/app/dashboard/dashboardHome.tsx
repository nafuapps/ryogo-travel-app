import { pageClassName } from "@/components/page/pageCommons"
import DashboardBookingMetricsComponent from "./components/home/metrics/dashboardBookingMetricsComponent"
import DashboardDriverMetricsComponent from "./components/home/metrics/dashboardDriverMetricsComponent"
import DashboardRevenueMetricsComponent from "./components/home/metrics/dashboardRevenueMetricComponent"
import DashboardVehicleMetricsComponent from "./components/home/metrics/dashboardVehicleMetricsComponent"
import DashboardOngoingTripSection from "./components/home/ongoingTrips/dashboardOngoingTripSection"

/*
 * Bookings - Confirmed (Lead, In progress, Completed, Cancelled)
 * Vehicles - total (Available, In trip, Repair, Inactive)
 * Drivers - total (Available, In trip, Leave, Inactive)
 * Revenue - Last 24 hrs [based on confirmed bookings] (Transactions In/out  )
 * Ongoing trips list
 * Immediate Actions to be taken
 * Graph - Bookings in the last 7/15/30 days
 */

export default function DashboardHomePageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  return (
    <div id="DashboardPage" className={pageClassName}>
      <div
        id="DashboardMetricsSection"
        className="grid gap-2 lg:gap-3 grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-1 md:grid-rows-4 lg:grid-cols-2 lg:grid-rows-2 2xl:grid-cols-4 2xl:grid-rows-1"
      >
        <DashboardBookingMetricsComponent agencyId={agencyId} />
        <DashboardRevenueMetricsComponent agencyId={agencyId} />
        <DashboardVehicleMetricsComponent agencyId={agencyId} />
        <DashboardDriverMetricsComponent agencyId={agencyId} />
      </div>
      <DashboardOngoingTripSection agencyId={agencyId} />
    </div>
  )
}
