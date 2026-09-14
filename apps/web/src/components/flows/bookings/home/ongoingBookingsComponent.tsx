"use client"

import { RyogoSmall, RyogoCaption } from "@/components/typography"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"
import { Route } from "lucide-react"
import {
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { OngoingBookingCard } from "@/components/cards/booking/bookingCards"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { useTranslations } from "next-intl"

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
      <SectionRowWrapper className="items-center">
        <SectionHeaderWrapper>
          <RyogoIcon icon={Route} size="sm" color="light" />
          <RyogoSmall color="light">{t("Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {trips.length}
          </RyogoSmall>
        </SectionHeaderWrapper>
        <SectionRowWrapper className="items-center justify-end">
          <RyogoCaption color="light">{t("ShowAgencyOngoing")}</RyogoCaption>
          <Switch
            checked={showAgencyBookings}
            onCheckedChange={setShowAgencyBookings}
          />
        </SectionRowWrapper>
      </SectionRowWrapper>
      {trips.map((trip) => (
        <OngoingBookingCard key={trip.id} booking={trip} />
      ))}
    </SectionWrapper>
  )
}
