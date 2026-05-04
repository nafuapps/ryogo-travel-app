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
import { format } from "date-fns"
import { CheckCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import moment from "moment"
import { iconClassName } from "@/components/page/pageCommons"
import { FindCompletedBookingsPreviousDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"

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
    selectedTab === "24hrs" ? completedBookings24Hrs : completedBookings7Days

  return (
    <SectionWrapper id="CompletedBookingsSection">
      <div
        id="CompletedBookingsHeader"
        className="flex flex-row justify-between items-center"
      >
        <SectionHeaderWrapper>
          <CheckCheck className={iconClassName} />
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
        <CompletedComponent key={trip.bookingId} {...trip} />
      ))}
    </SectionWrapper>
  )
}

function CompletedComponent(
  props: FindCompletedBookingsPreviousDaysType[number],
) {
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
          <Caption>{format(props.updatedAt, "PP")}</Caption>
          <PBold>{moment(props.updatedAt).fromNow()}</PBold>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
