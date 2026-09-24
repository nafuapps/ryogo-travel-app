"use client"

import { RyogoCaption } from "@/components/typography"
import { Ban, TicketX } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindCancelledBookingsPreviousDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { Switch } from "@/components/ui/switch"
import { CancelledBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"

export default function CancelledBookingsComponent({
  cancelledBookings,
  userId,
}: {
  userId: string
  cancelledBookings: FindCancelledBookingsPreviousDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Cancelled")
  const [showAgencyBookings, setShowAgencyBookings] = useState(false)

  const trips = showAgencyBookings
    ? cancelledBookings
    : cancelledBookings.filter((b) => b.assignedUser.id === userId)

  return (
    <SectionWrapper id="cancelledBookingsSection">
      <SectionRowWrapper className="items-center justify-between">
        <SectionHeaderWrapper
          icon={Ban}
          label={t("Title")}
          count={trips.length}
        />
        <SectionRowWrapper className="items-center justify-end">
          <RyogoCaption color="light">{t("ShowAgencyCancelled")}</RyogoCaption>
          <Switch
            checked={showAgencyBookings}
            onCheckedChange={setShowAgencyBookings}
          />
        </SectionRowWrapper>
      </SectionRowWrapper>
      {trips.length > 0 ? (
        <TileGridWrapper>
          {trips.map((trip) => (
            <CancelledBookingCard key={trip.id} booking={trip} />
          ))}
        </TileGridWrapper>
      ) : (
        <EmptyStateIcon icon={TicketX} label={t("NoTrips")} />
      )}
    </SectionWrapper>
  )
}
