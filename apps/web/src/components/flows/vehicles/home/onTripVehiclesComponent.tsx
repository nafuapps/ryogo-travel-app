import { Route } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
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
      <SectionHeaderWrapper
        icon={Route}
        label={t("OngoingTrips")}
        count={ongoingTrips.length}
      />
      <TileGridWrapper>
        {ongoingTrips.map((booking) => (
          <OngoingBookingCard key={booking.id} booking={booking} />
        ))}
      </TileGridWrapper>
    </SectionWrapper>
  )
}
