"use client"

import { SmallGrey, H5Grey, PBold, Caption } from "@/components/typography"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LucideBookOpen } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import moment from "moment"
import { iconClassName } from "@/components/page/pageCommons"
import { FindLeadBookingsPreviousDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"

export default function LeadBookingsItemComponent({
  leadBookings7Days,
}: {
  leadBookings7Days: FindLeadBookingsPreviousDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Leads")
  const [selectedTab, setSelectedTab] = useState("24hrs")

  const leadBookings24Hrs = leadBookings7Days.filter(
    (b) => b.createdAt > new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  )

  const trips = selectedTab === "24hrs" ? leadBookings24Hrs : leadBookings7Days

  return (
    <SectionWrapper id="leadsBookingsSection">
      <div
        id="leadsBookingsHeader"
        className="flex flex-row justify-between items-center"
      >
        <SectionHeaderWrapper>
          <LucideBookOpen className={iconClassName} />
          <SmallGrey>{t("Title")}</SmallGrey>
          <H5Grey>{trips.length}</H5Grey>
        </SectionHeaderWrapper>
        <Select
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="24hrs">{t("24Hrs")}</SelectItem>
              <SelectItem value="7days">{t("7Days")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {trips.map((trip) => (
        <LeadBookingsComponent key={trip.bookingId} {...trip} />
      ))}
    </SectionWrapper>
  )
}

function LeadBookingsComponent(
  props: FindLeadBookingsPreviousDaysType[number],
) {
  const t = useTranslations("Dashboard.Bookings.Leads")
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`}>
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{props.bookingId}</Caption>
          <PBold>{props.customerName}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{props.type.toUpperCase()}</Caption>
          <PBold>{props.route}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>
            {props.amount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </Caption>
          <PBold>{props.assignedUser}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{props.passengers + " " + t("Passengers")}</Caption>
          <PBold>{moment(props.createdAt).fromNow()}</PBold>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
