"use client"

import { PGrey, H5Grey, PBold, Caption, PRed } from "@/components/typography"
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
import {
  gridClassName,
  gridItemClassName,
  sectionClassName,
  sectionHeaderClassName,
  iconClassName,
} from "../../components/pageCommons"
import { FindUpcomingBookingsNextDaysType } from "@ryogo-travel-app/api/services/booking.services"

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
    selectedTab == "24hrs" ? upcomingBookings24Hrs : upcomingBookings7Days

  return (
    <div id="UpcomingBookingsSection" className={sectionClassName}>
      <div
        id="UpcomingBookingsHeader"
        className="flex flex-row justify-between items-center"
      >
        <div className={sectionHeaderClassName}>
          <LucideClock className={iconClassName} />
          <PGrey>{t("Title")}</PGrey>
          <H5Grey>{trips.length}</H5Grey>
        </div>
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
    </div>
  )
}

function UpcomingComponent(props: FindUpcomingBookingsNextDaysType[number]) {
  const startDate = moment(props.startDate)
  const startTime = moment(props.startTime)
  startDate.hours(startTime.hours())
  startDate.minutes(startTime.minutes())
  startDate.seconds(startTime.seconds())
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{props.bookingId}</Caption>
          <PBold>{props.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.type.toUpperCase()}</Caption>
          <PBold>{props.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.vehicle}</Caption>
          <PBold>{props.driver}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{format(props.startDate, "PP")}</Caption>
          {props.startDate < new Date() ? (
            <PRed>{startDate.fromNow()}</PRed>
          ) : (
            <PBold>{startDate.fromNow()}</PBold>
          )}
        </div>
      </div>
    </Link>
  )
}
