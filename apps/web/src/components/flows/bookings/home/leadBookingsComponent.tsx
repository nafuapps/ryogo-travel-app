"use client"

import { RyogoSmall, RyogoP, RyogoCaption } from "@/components/typography"
import { BookOpenText } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import moment from "moment"
import { FindLeadBookingsType } from "@ryogo-travel-app/api/services/booking.services"
import {
  GridItemWrapper,
  HoverGridWrapper,
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
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
        <SectionHeaderWrapper>
          <RyogoIcon icon={BookOpenText} size="sm" color="light" />
          <RyogoSmall color="light">{t("Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {selectedLeadBookings.length}
          </RyogoSmall>
        </SectionHeaderWrapper>
        <SectionRowWrapper className="items-center justify-end">
          <RyogoCaption color="light">{t("ShowAgencyLeads")}</RyogoCaption>
          <Switch
            checked={showAgencyLeads}
            onCheckedChange={setShowAgencyLeads}
          />
        </SectionRowWrapper>
      </SectionRowWrapper>
      {selectedLeadBookings.map((trip) => (
        <LeadBookingCard key={trip.id} lead={trip} />
      ))}
    </SectionWrapper>
  )
}
