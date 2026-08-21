"use client"

import { RyogoSmall, RyogoP, RyogoCaption } from "@/components/typography"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpenText } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import moment from "moment"
import { FindLeadBookingsPreviousDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  GridItemWrapper,
  HoverGridWrapper,
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

type LeadBookingsSelectType = "24Hrs" | "7Days"

export default function LeadBookingsItemComponent({
  leadBookings7Days,
}: {
  leadBookings7Days: FindLeadBookingsPreviousDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Leads")
  const [selectedTab, setSelectedTab] =
    useState<LeadBookingsSelectType>("24Hrs")

  const leadBookings24Hrs = leadBookings7Days.filter(
    (b) => b.createdAt > new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  )

  const trips = selectedTab === "24Hrs" ? leadBookings24Hrs : leadBookings7Days

  return (
    <SectionWrapper id="leadsBookingsSection">
      <SectionRowWrapper center>
        <SectionHeaderWrapper>
          <RyogoIcon icon={BookOpenText} size="sm" color="light" />
          <RyogoSmall color="light">{t("Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {trips.length}
          </RyogoSmall>
        </SectionHeaderWrapper>
        <Select
          value={selectedTab}
          onValueChange={(value: LeadBookingsSelectType) =>
            setSelectedTab(value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="24Hrs">{t("24Hrs")}</SelectItem>
              <SelectItem value="7Days">{t("7Days")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </SectionRowWrapper>
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
      <HoverGridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{props.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.customerName}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{props.type.toUpperCase()}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.route}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {props.amount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {props.assignedUser}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {props.passengers + " " + t("Passengers")}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {moment(props.createdAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}
