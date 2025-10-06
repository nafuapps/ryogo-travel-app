import { PGrey } from "@/components/typography";
import React from "react";
import DashboardOngoingTripComponent from "./dashboardOngoingTripComponent";
import { getTranslations } from "next-intl/server";
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardOngoingTripSection() {
  const t = await getTranslations("Dashboard.Home.OngoingTrips");
  const user = await getCurrentUser();

  // const ongoingTrips = await bookingServices.findOngoingTrips(user!.agencyId);

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
    <div
      id="DashboardOngoingTrips"
      className="flex flex-col w-full gap-3 lg:gap-4 bg-white shadow rounded-lg p-4 lg:p-5"
    >
      <PGrey>{t("Title") + " (" + ongoingTrips.length + ")"}</PGrey>
      <div className="grid flex-wrap gap-2 lg:gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {ongoingTrips.map((trip, index) => (
          <DashboardOngoingTripComponent key={index} {...trip} />
        ))}
      </div>
    </div>
  );
}
