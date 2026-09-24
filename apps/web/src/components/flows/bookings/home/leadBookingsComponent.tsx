"use client"

import { RyogoCaption } from "@/components/typography"
import { BookOpenText, TicketX } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindLeadBookingsType } from "@ryogo-travel-app/api/services/booking.services"
import {
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { Switch } from "@/components/ui/switch"
import { LeadBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"

export default function LeadBookingsComponent({
  leadBookings,
  userId,
}: {
  leadBookings: FindLeadBookingsType
  userId: string
}) {
  const t = useTranslations("Dashboard.Bookings.Leads")
  const [showAgencyLeads, setShowAgencyLeads] = useState(false)

  const trips = showAgencyLeads
    ? leadBookings
    : leadBookings.filter((b) => b.assignedUser.id === userId)

  return (
    <SectionWrapper id="leadsBookingsSection">
      <SectionRowWrapper className="items-center justify-between">
        <SectionHeaderWrapper
          icon={BookOpenText}
          label={t("Title")}
          count={trips.length}
        />
        <SectionRowWrapper className="items-center justify-end">
          <RyogoCaption color="light">{t("ShowAgencyLeads")}</RyogoCaption>
          <Switch
            checked={showAgencyLeads}
            onCheckedChange={setShowAgencyLeads}
          />
        </SectionRowWrapper>
      </SectionRowWrapper>
      {trips.length > 0 ? (
        <TileGridWrapper>
          {trips.map((trip) => (
            <LeadBookingCard key={trip.id} booking={trip} />
          ))}
        </TileGridWrapper>
      ) : (
        <EmptyStateIcon icon={TicketX} label={t("NoTrips")} />
      )}
    </SectionWrapper>
  )
}
