"use client"

import { RyogoSmall, RyogoCaption } from "@/components/typography"
import { CheckCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindCompletedBookingsPreviousDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { CompletedBookingCard } from "@/components/cards/booking/bookingCards"
import { Switch } from "@/components/ui/switch"

export default function CompletedBookingsComponent({
  completedBookings,
  userId,
}: {
  userId: string
  completedBookings: FindCompletedBookingsPreviousDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Completed")
  const [showAgencyBookings, setShowAgencyBookings] = useState(false)

  const trips = showAgencyBookings
    ? completedBookings
    : completedBookings.filter((b) => b.assignedUser.id === userId)

  return (
    <SectionWrapper id="CompletedBookingsSection">
      <SectionRowWrapper center>
        <SectionHeaderWrapper>
          <RyogoIcon icon={CheckCheck} size="sm" color="light" />
          <RyogoSmall color="light">{t("Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {trips.length}
          </RyogoSmall>
        </SectionHeaderWrapper>
        <SectionRowWrapper center justifyEnd>
          <RyogoCaption color="light">{t("ShowAgencyCompleted")}</RyogoCaption>
          <Switch
            checked={showAgencyBookings}
            onCheckedChange={setShowAgencyBookings}
          />
        </SectionRowWrapper>
      </SectionRowWrapper>
      {trips.map((trip) => (
        <CompletedBookingCard key={trip.id} booking={trip} />
      ))}
    </SectionWrapper>
  )
}
