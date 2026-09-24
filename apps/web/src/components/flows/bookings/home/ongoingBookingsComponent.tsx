"use client"

import { RyogoCaption } from "@/components/typography"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"
import { Route, TicketX } from "lucide-react"
import {
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { OngoingBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { useTranslations } from "next-intl"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"

export default function OngoingBookingsComponent({
  ongoingTrips,
  userId,
}: {
  userId: string
  ongoingTrips: FindOngoingTripsType
}) {
  const t = useTranslations("Dashboard.Bookings.Ongoing")
  const [showAgencyBookings, setShowAgencyBookings] = useState(false)

  const trips = showAgencyBookings
    ? ongoingTrips
    : ongoingTrips.filter((b) => b.assignedUser.id === userId)

  return (
    <SectionWrapper id="OngoingBookingsSection">
      <SectionRowWrapper className="items-center justify-between">
        <SectionHeaderWrapper
          icon={Route}
          label={t("Title")}
          count={trips.length}
        />
        <SectionRowWrapper className="items-center justify-end">
          <RyogoCaption color="light">{t("ShowAgencyOngoing")}</RyogoCaption>
          <Switch
            checked={showAgencyBookings}
            onCheckedChange={setShowAgencyBookings}
          />
        </SectionRowWrapper>
      </SectionRowWrapper>
      {trips.length > 0 ? (
        <TileGridWrapper>
          {trips.map((trip) => (
            <OngoingBookingCard key={trip.id} booking={trip} />
          ))}
        </TileGridWrapper>
      ) : (
        <EmptyStateIcon icon={TicketX} label={t("NoTrips")} />
      )}
    </SectionWrapper>
  )
}
