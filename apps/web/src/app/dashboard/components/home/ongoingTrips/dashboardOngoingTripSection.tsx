import { PGrey } from "@/components/typography"
import DashboardOngoingTripComponent from "./dashboardOngoingTripComponent"
import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export default async function DashboardOngoingTripSection({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.OngoingTrips")

  const ongoingTrips = await bookingServices.findOngoingTrips(agencyId)

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
  )
}
