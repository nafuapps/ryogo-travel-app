"use client"

import { RyogoSmall, RyogoCaption } from "@/components/typography"
import { Clock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindUpcomingBookingsNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { UpcomingBookingCard } from "@/components/cards/booking/bookingCards"
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
      <SectionRowWrapper center>
        <SectionHeaderWrapper>
          <RyogoIcon icon={Clock} size="sm" color="light" />
          <RyogoSmall color="light">{t("Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {trips.length}
          </RyogoSmall>
        </SectionHeaderWrapper>
        <SectionRowWrapper center justifyEnd>
          <RyogoCaption color="light">{t("ShowAgencyUpcoming")}</RyogoCaption>
          <Switch
            checked={showAgencyBookings}
            onCheckedChange={setShowAgencyBookings}
          />
        </SectionRowWrapper>
      </SectionRowWrapper>
      {trips.map((trip) => (
        <UpcomingBookingCard key={trip.id} booking={trip} />
      ))}
    </SectionWrapper>
  )
}
