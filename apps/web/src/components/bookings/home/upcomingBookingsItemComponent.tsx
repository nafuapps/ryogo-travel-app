"use client"

import {
  SmallGrey,
  H5Grey,
  PBold,
  Caption,
  PRed,
} from "@/components/typography"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LucideClock } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"
import moment from "moment"
import { iconClassName } from "@/components/page/pageCommons"
import { FindUpcomingBookingsNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import { getCombinedDateTime } from "@/lib/utils"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"

export default function UpcomingBookingsItemComponent({
  upcomingBookings7Days,
}: {
  upcomingBookings7Days: FindUpcomingBookingsNextDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Upcoming")
  const [selectedTab, setSelectedTab] = useState("24hrs")

  const upcomingBookings24Hrs = upcomingBookings7Days.filter(
    (b) =>
      new Date(b.startDate) <
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  )

  const trips =
    selectedTab === "24hrs" ? upcomingBookings24Hrs : upcomingBookings7Days

  return (
    <SectionWrapper id="UpcomingBookingsSection">
      <div
        id="UpcomingBookingsHeader"
        className="flex flex-row justify-between items-center"
      >
        <SectionHeaderWrapper>
          <LucideClock className={iconClassName} />
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
        <UpcomingComponent key={trip.bookingId} {...trip} />
      ))}
    </SectionWrapper>
  )
}

function UpcomingComponent(props: FindUpcomingBookingsNextDaysType[number]) {
  const combinedDateTime = getCombinedDateTime(props.startDate, props.startTime)
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
          <Caption>{props.vehicle}</Caption>
          <PBold>{props.driver}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{format(props.startDate, "dd MMM hh:mm aaa")}</Caption>
          {combinedDateTime < new Date() ? (
            <PRed>{moment(combinedDateTime).fromNow()}</PRed>
          ) : (
            <PBold>{moment(combinedDateTime).fromNow()}</PBold>
          )}
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
