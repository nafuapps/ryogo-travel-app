import DashboardOngoingTripComponent from "./components/dashboardOngoingTrips";
import { PGrey } from "@/components/typography";
import { getTranslations } from "next-intl/server";
import { pageClassName } from "@/components/page/pageCommons";
import DashboardBookingMetricsComponent from "./components/home/dashboardBookingMetricsComponent";
import DashboardDriverMetricsComponent from "./components/home/dashboardDriverMetricsComponent";
import DashboardRevenueMetricsComponent from "./components/home/dashboardRevenueMetricComponent";
import DashboardVehicleMetricsComponent from "./components/home/dashboardVehicleMetricsComponent";

/*
 * Bookings - Confirmed (Lead, In progress, Completed, Cancelled)
 * Vehicles - total (Available, In trip, Repair, Inactive)
 * Drivers - total (Available, In trip, Leave, Inactive)
 * Revenue - Last 24 hrs [based on confirmed bookings] (Transactions In/out  )
 * Ongoing trips list
 * Immediate Actions to be taken
 * Graph - Bookings in the last 7/15/30 days
 */

export default async function DashboardHomeComponent() {
  const t = await getTranslations("Dashboard.Home");

  const ongoingTrips = [
    {
      bookingId: "B1234255",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      status: "Picked Up",
    },
    {
      bookingId: "B1234255",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      status: "Picked Up",
    },
    {
      bookingId: "B1234255",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      status: "Picked Up",
    },
  ];

  return (
    <div id="DashboardPage" className={pageClassName}>
      <div
        id="DashboardMetrics"
        className="grid gap-2 lg:gap-3 grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-1 md:grid-rows-4 lg:grid-cols-2 lg:grid-rows-2"
      >
        <DashboardBookingMetricsComponent />
        <DashboardRevenueMetricsComponent />
        <DashboardVehicleMetricsComponent />
        <DashboardDriverMetricsComponent />
      </div>
      <div
        id="DashboardOngoingTrips"
        className="flex flex-col w-full gap-3 lg:gap-4 bg-white shadow rounded-lg p-4 lg:p-5"
      >
        <PGrey>{t("OngoingTrips") + " (" + ongoingTrips.length + ")"}</PGrey>
        <div className="grid flex-wrap gap-2 lg:gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {ongoingTrips.map((trip, index) => (
            <DashboardOngoingTripComponent key={index} {...trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
