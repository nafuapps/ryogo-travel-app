import { RyogoH4, RyogoSmall } from "@/components/typography"
import DashboardOngoingTripComponent from "./dashboardOngoingTripComponent"
import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { Route } from "lucide-react"
import {
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default async function DashboardOngoingTripSection({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.OngoingTrips")

  const ongoingTrips = await bookingServices.findOngoingTrips(agencyId)

  return (
    <SectionWrapper id="DashboardOngoingTrips">
      <SectionHeaderWrapper>
        <RyogoIcon icon={Route} size="sm" />
        <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
        <RyogoH4 color="slate"> {ongoingTrips.length}</RyogoH4>
      </SectionHeaderWrapper>
      <div className="grid flex-wrap gap-2 lg:gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {ongoingTrips.map((trip, index) => (
          <DashboardOngoingTripComponent key={index} {...trip} />
        ))}
      </div>
    </SectionWrapper>
  )
}
