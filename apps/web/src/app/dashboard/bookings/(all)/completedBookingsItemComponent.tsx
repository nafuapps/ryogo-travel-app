"use client"

import { PGrey, H5Grey, PBold, Caption } from "@/components/typography"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { LucideCheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import moment from "moment"
import {
  gridClassName,
  gridItemClassName,
  sectionClassName,
  sectionHeaderClassName,
  iconClassName,
} from "@/components/page/pageCommons"
import { FindCompletedBookingsPreviousDaysType } from "@ryogo-travel-app/api/services/booking.services"

export default function CompletedBookingsItemComponent({
  completedBookings7Days,
}: {
  completedBookings7Days: FindCompletedBookingsPreviousDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Completed")
  const [selectedTab, setSelectedTab] = useState("24hrs")

  const completedBookings24Hrs = completedBookings7Days.filter(
    (b) => b.updatedAt > new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  )

  const trips =
    selectedTab == "24hrs" ? completedBookings24Hrs : completedBookings7Days

  return (
    <div id="CompletedBookingsSection" className={sectionClassName}>
      <div
        id="CompletedBookingsHeader"
        className="flex flex-row justify-between items-center"
      >
        <div className={sectionHeaderClassName}>
          <LucideCheckCircle className={iconClassName} />
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
        <CompletedComponent key={trip.bookingId} {...trip} />
      ))}
    </div>
  )
}

function CompletedComponent(
  props: FindCompletedBookingsPreviousDaysType[number],
) {
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
          <Caption>{format(props.updatedAt, "PP")}</Caption>
          <PBold>{moment(props.updatedAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  )
}
