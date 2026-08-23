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
import { FindLeadBookingsNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  GridItemWrapper,
  HoverGridWrapper,
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { differenceInDays } from "date-fns"

type LeadBookingsSelectType = "14Days" | "7Days"

export default function LeadBookingsItemComponent({
  leadBookings14Days,
}: {
  leadBookings14Days: FindLeadBookingsNextDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Leads")
  const [selectedTab, setSelectedTab] =
    useState<LeadBookingsSelectType>("7Days")

  const leadBookings7Days = leadBookings14Days.filter(
    (b) => differenceInDays(b.startDate, new Date()) < 7,
  )

  const trips =
    selectedTab === "14Days" ? leadBookings14Days : leadBookings7Days

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
              <SelectItem value="7Days">{t("7Days")}</SelectItem>
              <SelectItem value="14Days">{t("14Days")}</SelectItem>
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

function LeadBookingsComponent(props: FindLeadBookingsNextDaysType[number]) {
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
            {moment(props.startDate).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}
