"use client"

import { RyogoCaption } from "@/components/typography"
import { Clock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindUpcomingBookingsNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { UpcomingBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import { Switch } from "@/components/ui/switch"

export default function UpcomingBookingsComponent({
  upcomingBookings,
  userId,
}: {
  userId: string
  upcomingBookings: FindUpcomingBookingsNextDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Upcoming")

  const [showAgencyBookings, setShowAgencyBookings] = useState(false)

  const trips = showAgencyBookings
    ? upcomingBookings
    : upcomingBookings.filter((b) => b.assignedUser.id === userId)

  return (
    <SectionWrapper id="UpcomingBookingsSection">
      <SectionRowWrapper className="items-center justify-between">
        <SectionHeaderWrapper
          icon={Clock}
          label={t("Title")}
          count={trips.length}
        />
        <SectionRowWrapper className="items-center justify-end">
          <RyogoCaption color="light">{t("ShowAgencyUpcoming")}</RyogoCaption>
          <Switch
            checked={showAgencyBookings}
            onCheckedChange={setShowAgencyBookings}
          />
        </SectionRowWrapper>
      </SectionRowWrapper>
      <TileGridWrapper>
        {trips.map((trip) => (
          <UpcomingBookingCard key={trip.id} booking={trip} />
        ))}
      </TileGridWrapper>
    </SectionWrapper>
  )
}
