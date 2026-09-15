"use client"

import { RyogoSmall, RyogoCaption } from "@/components/typography"
import { BookOpenText } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindLeadBookingsType } from "@ryogo-travel-app/api/services/booking.services"
import {
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Switch } from "@/components/ui/switch"
import { LeadBookingCard } from "@/components/flows/bookings/cards/bookingCards"

export default function LeadBookingsComponent({
  leadBookings,
  userId,
}: {
  leadBookings: FindLeadBookingsType
  userId: string
}) {
  const t = useTranslations("Dashboard.Bookings.Leads")
  const [showAgencyLeads, setShowAgencyLeads] = useState(false)

  const selectedLeadBookings = showAgencyLeads
    ? leadBookings
    : leadBookings.filter((b) => b.assignedUser.id === userId)

  return (
    <SectionWrapper id="leadsBookingsSection">
      <SectionRowWrapper className="items-center justify-between">
        <SectionRowWrapper className="items-center">
          <RyogoIcon icon={BookOpenText} size="sm" color="light" />
          <RyogoSmall color="light">{t("Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {selectedLeadBookings.length}
          </RyogoSmall>
        </SectionRowWrapper>
        <SectionRowWrapper className="items-center justify-end">
          <RyogoCaption color="light">{t("ShowAgencyLeads")}</RyogoCaption>
          <Switch
            checked={showAgencyLeads}
            onCheckedChange={setShowAgencyLeads}
          />
        </SectionRowWrapper>
      </SectionRowWrapper>
      <TileGridWrapper>
        {selectedLeadBookings.map((trip) => (
          <LeadBookingCard key={trip.id} booking={trip} />
        ))}
      </TileGridWrapper>
    </SectionWrapper>
  )
}
