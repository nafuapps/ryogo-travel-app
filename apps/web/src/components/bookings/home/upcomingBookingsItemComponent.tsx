"use client"

import {
  RyogoSmall,
  RyogoH4,
  RyogoP,
  RyogoCaption,
} from "@/components/typography"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Clock } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"
import moment from "moment"
import { FindUpcomingBookingsNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import { getCombinedDateTime } from "@/lib/utils"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

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
          <RyogoIcon icon={Clock} size="sm" />
          <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
          <RyogoH4 color="slate"> {trips.length}</RyogoH4>
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
          <RyogoCaption color="slate">{props.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.customerName}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{props.type.toUpperCase()}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.route}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{props.vehicle}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.driver}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {format(props.startDate, "dd MMM hh:mm aaa")}
          </RyogoCaption>
          {combinedDateTime < new Date() ? (
            <RyogoP color="red">{moment(combinedDateTime).fromNow()}</RyogoP>
          ) : (
            <RyogoP weight="font-bold">
              {" "}
              {moment(combinedDateTime).fromNow()}
            </RyogoP>
          )}
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
