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
      <SectionRowWrapper className="items-center">
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
        <LeadBookingItemComponent key={trip.id} {...trip} />
      ))}
    </SectionWrapper>
  )
}

function LeadBookingItemComponent(lead: FindLeadBookingsType[number]) {
  const t = useTranslations("Dashboard.Bookings.Leads")
  return (
    <Link href={`/dashboard/bookings/${lead.id}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{lead.id}</RyogoCaption>
          <RyogoP weight="font-bold"> {lead.customer.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{lead.type.toUpperCase()}</RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {lead.source.city + " - " + lead.destination.city}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {lead.estimatedTotalAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {lead.assignedUser.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {lead.passengers + " " + t("Passengers")}
          </RyogoCaption>
          <RyogoP weight="font-bold">{moment(lead.startDate).fromNow()}</RyogoP>
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}
