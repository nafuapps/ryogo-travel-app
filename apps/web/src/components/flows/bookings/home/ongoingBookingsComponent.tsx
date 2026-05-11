import { RyogoP, RyogoSmall } from "@/components/typography"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"
import { Route } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { OngoingBookingCard } from "@/components/cards/booking/bookingCards"

export default async function OngoingBookingsComponent({
  ongoingTrips,
}: {
  ongoingTrips: FindOngoingTripsType
}) {
  const t = await getTranslations("Dashboard.Bookings.Ongoing")

  return (
    <SectionWrapper id="OngoingBookingsSection">
      <SectionHeaderWrapper>
        <RyogoIcon icon={Route} size="sm" />
        <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
        <RyogoP color="slate"> {ongoingTrips.length}</RyogoP>
      </SectionHeaderWrapper>
      {ongoingTrips.map((trip) => (
        <OngoingBookingCard key={trip.bookingId} booking={trip} />
      ))}
    </SectionWrapper>
  )
}
