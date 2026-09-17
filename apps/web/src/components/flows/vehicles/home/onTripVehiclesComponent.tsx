import { RyogoSmall } from "@/components/typography"
import { Route } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { OngoingBookingCard } from "../../bookings/cards/bookingCards"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"

export default async function OnTripVehiclesComponent({
  ongoingTrips,
}: {
  ongoingTrips: FindOngoingTripsType
}) {
  const t = await getTranslations("Dashboard.Vehicles")

  return (
    <SectionWrapper id="OnTripVehiclesSection">
      <SectionRowWrapper className="items-center">
        <RyogoIcon icon={Route} size="sm" color="light" />
        <RyogoSmall color="light">{t("OngoingTrips")}</RyogoSmall>
        <RyogoSmall color="light" weight="font-bold">
          {ongoingTrips.length}
        </RyogoSmall>
      </SectionRowWrapper>
      <TileGridWrapper>
        {ongoingTrips.map((booking) => (
          <OngoingBookingCard key={booking.id} booking={booking} />
        ))}
      </TileGridWrapper>
    </SectionWrapper>
  )
}
